/**
 * @description MeshCommander web server
 * @author Ylian Saint-Hilaire
 * @copyright Intel Corporation 2018-2020
 * @license Apache-2.0
 * @version v0.0.3
 */

module.exports.CreateWebServer = function (args) {
  var obj = {};

  obj.fs = require("fs");
  obj.net = require("net");
  obj.tls = require("tls");
  obj.path = require("path");
  obj.args = args;
  obj.express = require("express");
  obj.app = obj.express();
  obj.expressWs = require("express-ws")(obj.app);
  obj.interceptor = require("./interceptor");
  obj.common = require("./common.js");
  obj.constants = require("constants");
  obj.computerlist = null;
  obj.apiRouter = require("./api");

  obj.debug = function (msg) {
    if (args.debug) {
      console.log(msg);
    }
  };

  obj.getAmtPassword = function (host) {
    if (!obj.computerlist || obj.computerlist == null) return null;
    for (var i in obj.computerlist) {
      if (obj.computerlist[i].host == host) {
        return [obj.computerlist[i].user, obj.computerlist[i].pass];
      }
    }
    return null;
  };

  // Indicates to ExpressJS that the public folder should be used to serve static files. Mesh Commander will be at "default.htm".
  obj.app.use(obj.express.static(obj.path.join(__dirname, "public")));

  // API router to push and pull computers
  obj.app.use("/api", obj.apiRouter);

  // Pages are shipped as "default-<language>.htm", with "default.htm" holding English. The
  // available set is read from the public folder so it can never drift from what is on disk.
  var availableLanguages = [];
  try {
    availableLanguages = obj.fs
      .readdirSync(obj.path.join(__dirname, "public"))
      .map(function (name) {
        var match = /^default-(.+)\.htm$/.exec(name);
        return match == null ? null : match[1].toLowerCase();
      })
      .filter(function (language) {
        return language != null;
      });
  } catch (ex) {
    availableLanguages = ["de", "es", "fr", "it", "ja", "ko", "nl", "pt", "ru", "zh-chs"];
  }

  // Modern and regional tags mapped onto the legacy codes the page files are named with, the
  // same way MeshCentral maps them. Bare "zh" resolves to Simplified Chinese.
  var languageAliases = {
    zh: "zh-chs",
    "zh-cn": "zh-chs",
    "zh-hans": "zh-chs",
    "zh-my": "zh-chs",
    "zh-sg": "zh-chs",
    "zh-hant": "zh-cht",
    "zh-hk": "zh-cht",
    "zh-mo": "zh-cht",
    "zh-tw": "zh-cht",
    "pt-br": "pt",
  };

  // Split an Accept-Language header into tags ordered by descending quality.
  function getAcceptedLanguages(header) {
    if (header == null) return [];
    return header
      .split(",")
      .map(function (entry) {
        var parts = entry.trim().split(";");
        var quality = 1;
        for (var i = 1; i < parts.length; i++) {
          var match = /^q=([0-9.]+)$/.exec(parts[i].trim());
          if (match != null) quality = parseFloat(match[1]);
        }
        return { tag: parts[0].trim().toLowerCase(), quality: isNaN(quality) ? 0 : quality };
      })
      .filter(function (entry) {
        return entry.tag.length > 0 && entry.tag != "*" && entry.quality > 0;
      })
      .sort(function (a, b) {
        return b.quality - a.quality;
      })
      .map(function (entry) {
        return entry.tag;
      });
  }

  // Resolve the browser languages to a page suffix. An empty string means English "default.htm".
  // A regional tag falls back to its base language, so zh-TW lands on Traditional Chinese when
  // that page is present and on Simplified Chinese rather than a 404 when it is not.
  function resolveLanguage(header) {
    var tags = getAcceptedLanguages(header);
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i];
      var candidates = [];
      if (languageAliases[tag] != null) candidates.push(languageAliases[tag]);
      candidates.push(tag);
      var dash = tag.indexOf("-");
      if (dash > 0) {
        var base = tag.substring(0, dash);
        if (languageAliases[base] != null) candidates.push(languageAliases[base]);
        candidates.push(base);
      }
      for (var j = 0; j < candidates.length; j++) {
        if (candidates[j] == "en") return "";
        if (availableLanguages.indexOf(candidates[j]) >= 0) return "-" + candidates[j];
      }
    }
    return "";
  }

  // Indicates that any request to "/" should be redirected to "/default.htm" which is the Mesh Commander web application.
  obj.app.get("/", function (req, res) {
    var language = resolveLanguage(req.headers["accept-language"]);
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    res.redirect("/default" + language + ".htm");
  });

  // For the server version of Mesh Commander, we send the computer list without credential and insertion credentials in the stream.
  obj.app.get("/webrelay.ashx", function (req, res) {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    if (req.query.action == "getcomputerlist") {
      obj.fs.readFile("computerlist.config", "utf8", function (err, data) {
        if (err == null) {
          var list = JSON.parse(data);
          obj.computerlist = obj.common.Clone(list);
          for (var i in list) {
            delete list[i].pass;
          } // Remove all passwords.
          res.set({ "Content-Type": "application/json" });
          res.send(JSON.stringify(list));
        }
      });
    }
    try {
      res.close();
    } catch (e) {}
  });

  // Indicates to ExpressJS what we want to handle websocket requests on "/webrelay.ashx". This is the same URL as IIS making things simple, we can use the same web application for both IIS and Node.
  obj.app.ws("/webrelay.ashx", function (ws, req) {
    ws.pause();

    // When data is received from the web socket, forward the data into the associated TCP connection.
    // If the TCP connection is pending, buffer up the data until it connects.
    ws.on("message", function (msg) {
      // Convert a buffer into a string, "msg = msg.toString('ascii');" does not work
      var msg2 = "";
      for (var i = 0; i < msg.length; i++) {
        msg2 += String.fromCharCode(msg[i]);
      }
      msg = msg2;

      if (ws.interceptor) {
        msg = ws.interceptor.processBrowserData(msg);
      } // Run data thru interceptor
      ws.forwardclient.write(Buffer.from(msg, "ascii")); // Forward data to the associated TCP connection.
    });

    // If the web socket is closed, close the associated TCP connection.
    ws.on("close", function (req) {
      obj.debug(
        "Closing web socket connection to " +
          ws.upgradeReq.query.host +
          ":" +
          ws.upgradeReq.query.port +
          "."
      );
      if (ws.forwardclient) {
        try {
          ws.forwardclient.destroy();
        } catch (e) {}
      }
    });

    // We got a new web socket connection, initiate a TCP connection to the target Intel AMT host/port.
    obj.debug(
      "Opening web socket connection to " +
        req.query.host +
        ":" +
        req.query.port +
        "."
    );
    if (req.query.tls == 0) {
      // If this is TCP (without TLS) set a normal TCP socket
      ws.forwardclient = new obj.net.Socket();
      ws.forwardclient.setEncoding("binary");
      ws.forwardclient.forwardwsocket = ws;
    } else {
      // If TLS is going to be used, setup a TLS socket
      var tlsoptions = {
        secureProtocol:
          req.query.tls1only == 1 ? "TLSv1_method" : "SSLv23_method",
        ciphers: "RSA+AES:!aNULL:!MD5:!DSS",
        secureOptions:
          obj.constants.SSL_OP_NO_SSLv2 |
          obj.constants.SSL_OP_NO_SSLv3 |
          obj.constants.SSL_OP_NO_COMPRESSION |
          obj.constants.SSL_OP_CIPHER_SERVER_PREFERENCE,
        rejectUnauthorized: false,
      };
      ws.forwardclient = obj.tls.connect(
        req.query.port,
        req.query.host,
        tlsoptions,
        function () {
          // The TLS connection method is the same as TCP, but located a bit differently.
          obj.debug(
            "TLS connected to " + req.query.host + ":" + req.query.port + "."
          );
          ws.resume();
        }
      );
      ws.forwardclient.setEncoding("binary");
      ws.forwardclient.forwardwsocket = ws;
    }

    // When we receive data on the TCP connection, forward it back into the web socket connection.
    ws.forwardclient.on("data", function (data) {
      if (ws.interceptor) {
        data = ws.interceptor.processAmtData(data);
      } // Run data thru interceptor
      try {
        ws.send(Buffer.from(data, "ascii"));
      } catch (ex) {}
    });

    // If the TCP connection closes, disconnect the associated web socket.
    ws.forwardclient.on("close", function () {
      obj.debug(
        "TCP disconnected from " + req.query.host + ":" + req.query.port + "."
      );
      try {
        ws.close();
      } catch (ex) {}
    });

    // If the TCP connection causes an error, disconnect the associated web socket.
    ws.forwardclient.on("error", function (err) {
      obj.debug(
        "TCP disconnected with error from " +
          req.query.host +
          ":" +
          req.query.port +
          ": " +
          err.code +
          ", " +
          req.url
      );
      try {
        ws.close();
      } catch (ex) {}
    });

    // Fetch Intel AMT credentials & Setup interceptor
    var credentials = obj.getAmtPassword(req.query.host);
    if (credentials != null) {
      if (req.query.p == 1) {
        ws.interceptor = obj.interceptor.CreateHttpInterceptor({
          host: req.query.host,
          port: req.query.port,
          user: credentials[0],
          pass: credentials[1],
        });
      } else if (req.query.p == 2) {
        ws.interceptor = obj.interceptor.CreateRedirInterceptor({
          user: credentials[0],
          pass: credentials[1],
        });
      }
    }

    if (req.query.tls == 0) {
      // A TCP connection to Intel AMT just connected, send any pending data and start forwarding.
      ws.forwardclient.connect(req.query.port, req.query.host, function () {
        obj.debug(
          "TCP connected to " + req.query.host + ":" + req.query.port + "."
        );
        ws.resume();
      });
    }
  });

  // Start the ExpressJS web server
  var port = 3000;
  if (args.port != null) {
    port = parseInt(args.port);
  }
  if (
    isNaN(port) ||
    port == null ||
    typeof port != "number" ||
    port < 0 ||
    port > 65536
  ) {
    port = 3000;
  }
  if (args.any != null) {
    obj.app.listen(port, function () {
      console.log("MeshCommander running on http://*:" + port + ".");
    });
  } else {
    obj.app.listen(port, "0.0.0.0", function () {
      console.log("MeshCommander running on http://localhost:" + port + ".");
    });
  }

  return obj;
};
