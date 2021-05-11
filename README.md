# netsim-cli
A naive network simulator written in TypeScript + NodeJs | Work in progress.

[![asciicast](https://asciinema.org/a/410100.svg)](https://asciinema.org/a/410100)

## Setup
Install [node and npm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04).

```
git clone https://github.com/areebbeigh/netsim-cli.git
cd netsim-cli
npm install
```

Once all dependencies are installed, you're ready to go: `npm run start`. A sample is provided in `sample.nsim`

```
$ nestim-cli > help
app.js [command]

Commands:
  app.js add <device> [ports]                                                            Create a new device
  app.js assign-ip <deviceId> <interface> <ip>                                           Assign IP to a device interface
  app.js list-devices                                                                    List all devices
  app.js connect <deviceId1> <interface1> <deviceId2> <interface2> [successProbability]  Connect two device interfaces
  app.js send <deviceId> <destinationIp> <data>                                          Send data from a device to a destination ip
  app.js import <file>                                                                   Import a set of instructions from file
  app.js flow-control <flowControlName>                                                  Import a set of instructions from file
  app.js stats                                                                           Output stats on current topologies
  app.js exit                                                                            exit the cli

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

## Info
The project is divided into a "core" and a "cli". This is to allow for the possibility of a react based GUI using the same core.

<< further details to be added here >>

Originally my Computer Networks semester project at NIT Srinagar.

Cheers :tea:
