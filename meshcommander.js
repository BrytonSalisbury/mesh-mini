/**
 * @description MeshCommander
 * @author Ylian Saint-Hilaire
 * @copyright Intel Corporation 2018
 * @license Apache-2.0
 * @version v0.0.3
 */

function CreateMeshCommanderServer(args) {
  var obj = {};
  obj.args = require("minimist")(process.argv.slice(2));

  // Start the Meshcommander server
  obj.Start = function () {
    obj.webserver = require("./webserver.js").CreateWebServer(obj.args);
  };

  // Stop the Meshcommander server
  obj.Stop = function () {
    if (obj.webserver) {
      obj.webserver = null;
    }
  };

  return obj;
}

function InstallModules(modules, func) {
  if (modules.length == 0) {
    func();
    return;
  }
  InstallModule(modules.shift(), InstallModules, modules, func);
}

function InstallModule(modulename, func, tag1, tag2) {
  try {
    var module = require(modulename);
    module = null;
    func(tag1, tag2);
  } catch (e) {
    console.log("Installing " + modulename + "...");
    var child_process = require("child_process");
    child_process.exec(
      "npm install --save " + modulename,
      function (error, stdout, stderr) {
        func(tag1, tag2);
        return;
      }
    );
  }
}

InstallModules(["minimist", "express", "express-ws"], function () {
  CreateMeshCommanderServer().Start();
});
