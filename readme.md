# Mesh-Mini

Mesh-Mini is a fork of the npm package MeshCommander, due to the ending of support of the MeshCommander application located here - https://www.meshcommander.com/meshcommander.

The code has been modified to be bundled and injected into a copy of node.exe which will run without the need for Node.js to be installed.

The webapp can be run by simply invoking `node meshcommander.js`, but the intention of this repo is to bundle and inject the program into an .exe for ease of use and distribution.

## Run

Download the latest release [here](https://github.com/BrytonSalisbury/mesh-mini/releases), extract the contents, and run mesh-mini.exe

## Executable flags

The .exe can be passed a --port and --browser flag to specify the port to run on, and the browser to autolaunch.

The port can be any integer between 0 and 65,536.

Browser options are:

- chrome
- edge
- none

## To build the .exe from source

### Prerequisites

Node.js 19.7.0 or greater is required for the use of the --experimental-sea-config flag.

[node-v20.5.1](https://nodejs.org/dist/v20.5.1/node-v20.5.1-x64.msi)

Testing was done on Windows 11 using Node.js 20.5.1.

### Steps

1. Clone/download the repo and open a cmd prompt inside the root \mesh-mini directory
2. Execute `npm run build` to build the .exe.
3. The contents will be copied into the subfolder .\out which will contain mesh-mini.exe and the \public folder required for Express.

`npm run clean` can be used to clean the root directory.
