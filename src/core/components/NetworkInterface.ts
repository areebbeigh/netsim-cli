import { Netmask } from 'netmask';

import Connection from './Connection';
import type { BaseNode } from './BaseNode';
import getRandomMac from '../lib/randomMac';
import Packet from '../data/Packet';
import Frame from '../data/Frame';
import { InvalidIp, NoAssignedIp, AlreadyConnected } from '../errors';
import { EventType } from '../logger';
import config, { FlowControl } from '../config';
import { getFlowController } from '../flow-control/helpers';
import setInterval from '../lib/setInterval';

class NetworkInterface implements INetworkInterface {
  private flowControllers: {
    [key in FlowControl]?: IFlowController;
  } = {};
  // The packet being currently send. We allow a network interface to send only
  // one packet at a time because of races that occur in multiple sendPacket calls
  // when we need to do an ARP lookup before sending the packet in one of the calls
  private currentlySending: string | undefined;
  host;
  skipReceiveDestinationCheck;
  name;
  connection: Connection | undefined;
  mac;
  ip: string | undefined;
  subnet;

  constructor(
    host: BaseNode,
    name: string,
    skipReceiveDestinationCheck = false,
    ip = undefined
  ) {
    this.skipReceiveDestinationCheck = skipReceiveDestinationCheck;
    this.host = host;
    this.name = name;
    // TODO: Add check for mac collisions.
    this.mac = getRandomMac();
    this.ip = ip;
    // The only subnet we will work with for now
    this.subnet = '255.255.255.0';
  }

  get isConnected() {
    return !!this.connection;
  }

  get fullName() {
    return `${this.host.name}.${this.name}`;
  }

  get flowController() {
    const FlowController = getFlowController(config.FLOW_CONTROL);

    this.flowControllers[config.FLOW_CONTROL] =
      this.flowControllers[config.FLOW_CONTROL] ||
      new FlowController(this);

    return this.flowControllers[
      config.FLOW_CONTROL
    ] as IFlowController;
  }

  private throwNoIp() {
    throw new NoAssignedIp(
      `${this.host.name}.${this.name} interface has no IP assigned. Can't send packets.`
    );
  }

  assignIp(ip: string) {
    const netmask = new Netmask(ip, this.subnet);
    // TODO: Add check to see if this interface is a default gateway.
    // We can skip this since we don't have routers yet.
    if (ip === netmask.first) {
      throw new InvalidIp(
        'IP Address for a host interface cannot be the network default gateway.'
      );
    }
    if (ip === netmask.broadcast) {
      throw new InvalidIp('IP cannot be broadcast IP.');
    }
    if (ip === netmask.base) {
      throw new InvalidIp('IP cannot be the network ID.');
    }
    this.ip = ip;
    this.host.logger.logEvent(EventType.IP_ASSIGN, this.host, this);
  }

  connect(
    otherInterface: NetworkInterface,
    connection?: Connection
  ): Connection {
    if (
      !connection &&
      (otherInterface.connection || this.connection)
    ) {
      throw new AlreadyConnected(
        `Can't connect interfaces ${this.fullName} and ${otherInterface.fullName}. Other connections already exist.`
      );
    }

    const conn: Connection =
      connection || new Connection(this, otherInterface);
    this.connection = conn;

    // Connect the other interface to this if it doesn't have a connection already
    if (!otherInterface.connection)
      otherInterface.connect(this, this.connection);

    this.host.logger.logEvent(
      EventType.INTERFACE_CONNECT,
      this.host,
      this,
      otherInterface.host,
      otherInterface
    );
    return conn;
  }

  disconnect() {
    const otherInterface = this.connection?.getConnectedInterface(
      this
    );
    const otherHost = this.getConnectedNode();

    this.connection?.disconnect();
    this.host.logger.logEvent(
      EventType.INTERFACE_DISCONNECT,
      this.host,
      this,
      otherHost,
      otherInterface
    );
  }

  getConnectedNode() {
    return this.connection?.getConnectedInterface(this).host;
  }

  /**
   * Sends an empty broadcast frame for the destination ip.
   * We don't wait for the ACK. The caller should simply check the host's
   * ARP table agian.
   * @param ip
   */
  private sendArp(ip: string) {
    if (this.ip) {
      // Frames with destination as null are treated as broadcast frames
      const frame = new Frame(
        this.mac,
        null,
        new Packet(this.ip, ip, 'ARP')
      );
      this.host.logger.logEvent(
        EventType.ARP_SEND,
        this.host,
        this,
        undefined,
        undefined,
        frame
      );
      this.sendFrame(frame);
    } else {
      this.throwNoIp();
    }
  }

  doArpLookup(ip: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let arpRetries = 0;

      const sendIntervalId = setInterval(() => {
        const destinationMac = this.host.lookupArpTable(ip);
        if (!destinationMac) {
          this.sendArp(ip);
        }

        if (!destinationMac) {
          arpRetries++;
          if (arpRetries >= 5) {
            // Failed to arp lookup the receiver
            this.host.logger.logEvent(
              EventType.LINK_FAILURE,
              this.host,
              this,
              undefined,
              undefined,
              `ARP Retries: ${arpRetries}`
            );
            clearInterval(sendIntervalId);
          }
          return;
        }
        resolve(destinationMac as string);
      }, 500);
    });
  }

  sendData(ip: string, data: string): void {
    const senderIp = this.ip;
    if (senderIp) {
      const packets = Array.from(data).map(
        (char) => new Packet(senderIp, ip, char)
      );
      this.flowController.sendPackets(packets);
    } else this.throwNoIp();
  }

  sendPacket(packet: Packet): void {
    if (this.ip) {
      const ipBlock = new Netmask(this.ip, this.subnet);
      // Do ARP lookup for packet.destination
      let arpLookupIp = packet.destination;
      // Check if destination IP is local or remote
      if (!ipBlock.contains(packet.destination)) {
        // Do ARP lookup for default gateway if destination is remote
        arpLookupIp = ipBlock.base;
      }

      this.doArpLookup(arpLookupIp).then((destinationMac) => {
        const intervalId = setInterval(() => {
          if (this.currentlySending === undefined)
            this.currentlySending = packet.uuid;
          // There is a previous packet waiting to be sent. We have to wait.
          if (this.currentlySending !== packet.uuid) return;

          const frame = new Frame(this.mac, destinationMac, packet);
          this.sendFrame(frame);
          this.currentlySending = undefined;
          clearInterval(intervalId);
        }, 500);
      });
    } else this.throwNoIp();
  }

  sendFrame(frame: Frame): void {
    this.host.logger.logEvent(
      EventType.FRAME_SEND,
      this.host,
      this,
      undefined,
      undefined,
      frame
    );
    this.connection?.put(frame, this);
  }

  /**
   * Send an ACK for a frame
   * @param ip
   * @param frame
   */
  sendAck(ip: string, forFrame: Frame, data?: string) {
    if (this.ip) {
      const packet = new Packet(
        this.ip,
        forFrame.packet.source,
        data || ''
      );
      packet.isAck = true;
      this.host.logger.logEvent(
        EventType.ACK_SEND,
        this.host,
        this,
        undefined,
        undefined,
        packet
      );
      this.sendPacket(packet);
    } else this.throwNoIp();
  }

  receive(frame: Frame): void {
    this.host.logger.logEvent(
      EventType.FRAME_RECEIVE,
      this.host,
      this,
      undefined,
      undefined,
      frame
    );
    this.host.addToArpTable(frame.packet.source, frame.source);

    if (!this.skipReceiveDestinationCheck) {
      if (frame.destination === this.mac) {
        this.host.receive(frame, this);

        if (frame.isAck) {
          this.host.logger.logEvent(
            EventType.ACK_RECEIVE,
            this.host,
            this,
            undefined,
            undefined,
            frame
          );
        }

        // TODO: this is not forwarding ARPs to the flow controller
        if (frame.packet.data !== '')
          this.flowController.receive(frame);
      }
      // ARP request
      if (
        frame.destination == null &&
        frame.packet.destination === this.ip
      ) {
        this.sendAck(frame.packet.source, frame);
      }
    } else {
      this.host.receive(frame, this);
    }
  }
}

export default NetworkInterface;
export type { NetworkInterface };
