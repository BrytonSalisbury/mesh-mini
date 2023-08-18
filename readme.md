# Mesh-Mini

Mesh-Mini is a fork of the npm package MeshCommander, due to the ending of support of the MeshCommander application located here - https://www.meshcommander.com/meshcommander.

The code has been modified to be bundled and injected into a copy of node.exe which will run without the need for Node.js on any system.

The webapp can be run by simply invoking `node meshcommander.js`, but the intention of this repo is to bundle and inject the program into a .exe for ease of use.

### Prerequisites

Node.js 19.7.0 or greater is required for the use of the --experimental-sea-config flag.

Testing was done on Windows 11 using Node.js 20.5.1.

### To build the .exe from source

1. Run `npm i` to download the prerequisites.
2. Run `npm run build` to build the .exe.
3. The contents will be copied into the subfolder 'out' which will contain the .exe and the .html files needed to run the .exe.

### Executable flags

The .exe can be passed a --port and --browser flag to specify the port to run on, and the browser to autolaunch.

The port can be any integer between 0 and 65,536.

Browser options are:

- chrome
- edge
- none
