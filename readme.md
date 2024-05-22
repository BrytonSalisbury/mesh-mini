## Downloads

### [Client Version](https://github.com/BrytonSalisbury/mesh-mini/releases/download/v1.0.1/mesh-mini.zip)

For regular use, download the client version.

### [Server Version]()

The server version is intended to be used in a distributed environment where there will be multiple clients accessing a single instance of Mesh-Mini. A computer list can be stored on the server, then accessed remotely from clients so only a single computer list needs to be maintained. Docker would be recommended for this, explained further below.

# Mesh-Mini

Mesh-Mini is a fork of the npm package MeshCommander, due to the ending of support of the MeshCommander application found here - https://www.meshcommander.com/meshcommander.

The code has been modified to be bundled and injected into a copy of node.exe and is accessed via your localhost in a browser. Docker images are also provided below. This solution is **much** more performant than the original MeshCommander due to running in a modern browser.

## Run

Refer to Downloads at the top, extract the contents, and run mesh-mini.exe

## Executable flags

The .exe can be passed a --port and/or --browser flag to specify the port to run on, and the browser to autolaunch.

The port can be any integer between 0 and 65,536.

Browser options are:

- chrome
- edge
- none

## Docker

A Docker image can be pulled and then run with the following commands, where {architecture} is amd64 _(Windows)_ or arm64 _(Mac)_ depending on your platform:

`docker pull brytonsalisbury/mesh-mini:{architecture}`

`docker run -p 3000:3000 brytonsalisbury/mesh-mini:{architecture}`

The Docker image can be built from source using:

`docker build -t mesh-mini .`

### Note

The Docker image is running the 'server' version of Mesh-Mini which can store a central computer list inside the container. The container can be passed an environment variable, _COMPUTER_PATH_, which controls where the computer list is stored, i.e `COMPUTER_PATH=/config/computers.json`

This can be used in conjunction with a mounted volume so a computer list can be provided and maintained from local storage.

If the environment variable isn't provided, when a computer list is pushed to the server it will be stored in _/usr/src/app/computers.json_

https://hub.docker.com/r/brytonsalisbury/mesh-mini

## To build the .exe from source

### Prerequisites

Node.js 19.7.0 or greater is required for the use of the --experimental-sea-config flag.

[node-v20.5.1](https://nodejs.org/dist/v20.5.1/node-v20.5.1-x64.msi)

Testing was done on Windows 11 using Node.js 20.5.1.

### Steps

1. Clone/download the repo and open a cmd prompt inside the root /mesh-mini directory
2. Execute `npm run build` to build the .exe.
3. The contents will be copied into the subfolder /out which will contain mesh-mini.exe and the /public folder required for Express.

`npm run clean` can be used to clean the root directory.
