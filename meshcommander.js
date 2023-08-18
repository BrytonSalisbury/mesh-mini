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

function launchBrowser() {
  var obj = {};
  obj.args = require("minimist")(process.argv.slice(2)); // slice off the first 2 default args

  const port = obj.args.port || 3000;
  let browser = "";
  switch (obj.args.browser) {
    case "chrome":
      browser = "chrome";
      break;

    case "edge":
      browser = "msedge";
      break;

    default:
      browser = "chrome";
      break;
  }

  var child_process = require("child_process");
  child_process.exec(`start ${browser} http://localhost:${port}`);
}

launchBrowser();

CreateMeshCommanderServer().Start();
