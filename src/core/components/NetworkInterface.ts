import { Netmask } from 'netmask';

import Connection from './Connection';
import type { BaseNode } from './BaseNode';
import getRandomMac from '../lib/randomMac';
import Packet from '../data/Packet';
import Frame from '../data/Frame';
import { InvalidIp, NoAssignedIp } from '../errors';

class NetworkInterface implements INetworkInterface {
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

  assignIp(ip: string) {
    const netmask = new Netmask(ip, this.subnet);
    // TODO: Add check to see if this interface is a default gateway.
    // We can skip this since we don't have routers yet.
    if (ip === netmask.first) {
      throw new InvalidIp(
        'IP Address for a host interface cannot be the network default gateway.'
      );
    }
    this.ip = ip;
  }

  connect(otherInterface: NetworkInterface): Connection {
    if (otherInterface.connection && this.connection) {
      throw Error(
        `Can't connect interfaces. Other connections already exist.`
      );
    }

    const connection: Connection =
      this.connection ||
      otherInterface.connection ||
      new Connection(this, otherInterface);
    this.connection = connection;

    // Connect the other interface to this if it doesn't have a connection already
    if (!otherInterface.connection) otherInterface.connect(this);
    return connection;
  }

  disconnect() {
    this.connection?.disconnect();
  }

  getConnectedNode() {
    return this.connection?.getConnectedInterface(this).host;
  }

  get isConnected() {
    return !!this.connection;
  }

  private throwNoIp() {
    throw new NoAssignedIp(
      `${this.host.name}.${this.name} interface has no IP assigned. Can't send packets.`
    );
  }

  /**
   * Sends an empty broadcast frame for the destination ip.
   * We don't wait for the ACK. The caller should simply check the host's
   * ARP table agian.
   * @param ip
   */
  doArpLookup(ip: string) {
    if (this.ip) {
      // Frames with destination as null are treated as broadcast frames
      const frame = new Frame(
        this.mac,
        null,
        new Packet(this.ip, ip, 'ARP')
      );
      this.sendFrame(frame);
    } else {
      this.throwNoIp();
    }
  }

  sendData(ip: string, data: string): void {
    if (this.ip) {
      const packet = new Packet(this.ip, ip, data);
      this.sendPacket(packet);
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
      let destinationMac = this.host.lookupArpTable(arpLookupIp);
      if (!destinationMac) {
        this.doArpLookup(arpLookupIp);
        // TODO: How do we simulate network delays here?
        destinationMac = this.host.lookupArpTable(arpLookupIp);
      }

      if (!destinationMac) {
        // Packet dropped
      } else {
        const frame = new Frame(this.mac, destinationMac, packet);
        this.sendFrame(frame);
      }
    } else this.throwNoIp();
  }

  sendFrame(frame: Frame): void {
    this.connection?.put(frame, this);
  }

  /**
   * Send an ACK for a frame
   * @param ip
   * @param frame
   */
  sendAck(ip: string, forFrame: Frame) {
    if (this.ip) {
      const packet = new Packet(
        this.ip,
        forFrame.packet.source,
        'ACK'
      );
      this.sendPacket(packet);
    } else this.throwNoIp();
  }

  receive(frame: Frame): void {
    if (!this.skipReceiveDestinationCheck) {
      if (frame.destination === this.mac) {
        // TODO: Forward frame to host
        this.sendAck(frame.packet.source, frame);
      }
      // ARP request
      if (
        frame.destination == null &&
        frame.packet.destination === this.ip
      ) {
        this.sendAck(frame.packet.source, frame);
      }
    } else {
      // TODO: Forward the frame directly to the host
    }
  }
}

export default NetworkInterface;
export type { NetworkInterface };
