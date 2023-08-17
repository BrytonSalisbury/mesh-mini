MeshCommander
=============

For more information, [visit MeshCommander.com/meshcommander](http://www.meshcommander.com/meshcommander).

This is a web based Intel&reg; AMT management console. You can run this tool and use your browser to manage all your Intel&reg; AMT computers. Works on any operating system that supports NodeJS. The console support most of the Intel&reg; AMT features. Currently, this version of MeshCommander does not support TLS certificate checking.

A step up from this version of MeshCommander, is [MeshCentral](http://www.meshcommander.com/meshcentral2).


Installation
------------

Make sure you have NodeJS and npm installed. If you are behind a proxy, setup npm to use the proxy:

```
	npm config set proxy http://proxy.com:88
	npm config set https-proxy http://proxy.com:88
```

Then, install MeshCommander by creating an empty folder and using npm to download the module:

```
	mkdir meshcommander
	cd meshcommander
	npm install meshcommander
```

To run MeshCommander you may need to use "nodejs" instead of "node" on Linux.

```
	cd ./node_modules/meshcommander
	node meshcommander [arguments]
```


Update and uninstall
--------------------

Uninstalling MeshCommander is super easy, just use npm as usual. For updating, just install over the previous version by installing again. From the parent folder of node_module, enter ether:

```
	npm install meshcommander
	npm uninstall meshcommander
```

Command Line
------------

Command line arguments

| Arguments                             | Description
| ------------------------------------- | -----------
| --any 								| Bind MeshCommander on all interfaces. By default, it's bound to 127.0.0.1 only.
| --port (port) 						| Specify the server's port number. Default is 3000.


Tutorials
---------

Introduction to MeshCommander.

[![MeshCommander - Introduction](https://img.youtube.com/vi/k7xVkZSVY0E/mqdefault.jpg)](https://www.youtube.com/watch?v=k7xVkZSVY0E)


Using MeshCommander's hardware KVM viewer.

[![MeshCommander - Usages](https://img.youtube.com/vi/5EKw1g0L3IE/mqdefault.jpg)](http://www.youtube.com/watch?v=5EKw1g0L3IE)


Setting up Intel&reg; AMT with TLS.

[![MeshCommander - Intel AMT CIRA](https://img.youtube.com/vi/2WYanQ11gYE/mqdefault.jpg)](http://www.youtube.com/watch?v=2WYanQ11gYE)


License
-------

This software is licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).