// var headless = require('headless');

// var options = {
//   display: {width: 1024, height: 980, depth: 32},
//   args: ['-extension', 'RANDR'],
//   stdio: 'inherit'
// };

// headless(options, function(err, childProcess, servernum) {
//   // childProcess is a ChildProcess, as returned from child_process.spawn()
//   console.log('Xvfb running on server number', servernum);
//   console.log('Xvfb pid', childProcess.pid);
//   console.log('err should be null', err);
// });

const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var request = require("request");

const puppeteer = require("puppeteer");
const port = process.env.PORT || 8080;
var os = require("os");
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const validUrl = require("valid-url");
var path = require("path");

var parseUrl = function (url) {
  url = decodeURIComponent(url);
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url;
  }

  return url;
};
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());

app.use(express.static(__dirname + "/"));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/img/", function (req, res) {
  var urlToScreenshot = parseUrl(req.query.url);

  if (validUrl.isWebUri(urlToScreenshot)) {
    console.log("Screenshotting: " + urlToScreenshot);
    (async () => {
      const browser = await puppeteer.launch({
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
        ],
      });

      const page = await browser.newPage();
      await page.goto(urlToScreenshot);
      await page.setViewport({ width: 1536, height: 734 });
      await page.screenshot().then(function (buffer) {
        //res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
        res.setHeader("Content-Type", "image/png");
        res.send(buffer);
      });

      await browser.close();
    })();
  } else {
    res.send("Invalid url: " + urlToScreenshot);
  }
});
app.get("/imgview/", function (req, res) {
  var urlToScreenshot = parseUrl(req.query.url);

  if (validUrl.isWebUri(urlToScreenshot)) {
    console.log("Screenshotting: " + urlToScreenshot);
    (async () => {
      const browser = await puppeteer.launch({
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
        ],
      });

      const page = await browser.newPage();
      await page.goto(urlToScreenshot);
      await page.setViewport({ width: 1536, height: 734 });
      await page.screenshot().then(function (buffer) {
        //res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
        res.setHeader("Content-Type", "image/png");
        res.send(buffer);
      });

      await browser.close();
    })();
  } else {
    res.send("Invalid url: " + urlToScreenshot);
  }
});
app.get("/pdf/", function (req, res) {
  var urlToScreenshot = parseUrl(req.query.url);

  if (validUrl.isWebUri(urlToScreenshot)) {
    console.log("pdf: " + urlToScreenshot);
    (async () => {
      const browser = await puppeteer.launch({
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
        ],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 3072, height: 1469 });
      await page.goto(urlToScreenshot);
      await page.pdf({ format: "A4" }).then(function (buffer) {
        res.setHeader(
          "Content-Disposition",
          'attachment;filename="' + urlToScreenshot + '.pdf"'
        );
        res.setHeader("Content-Type", "application/pdf");
        res.send(buffer);
      });

      await browser.close();
    })();
  } else {
    res.send("Invalid url: " + urlToScreenshot);
  }
});
app.post("/createpdf/", function (req, res) {
  var htmlContent = "";
  var pdfname;
  var isBase64 = false;
  //console.log(req.body);
  try {
    htmlContent = req.body.content;
    pdfname = req.body.pdfname || "htmlToPdf.pdf";
    isBase64 = req.body.isBase64 || false;
  } catch (ex) {
    console.log(ex);
  }

  if (htmlContent != "") {
    (async () => {
      const browser = await puppeteer.launch({
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
        ],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 3072, height: 1469 });
      //console.log(htmlContent);
      await page.setContent(htmlContent);
      await page.pdf({ format: "A4" }).then(function (buffer) {
        if (isBase64) {
          res.setHeader("Content-Type", "text/plain");
          res.send(buffer.toString("base64"));
        } else {
          res.setHeader(
            "Content-Disposition",
            "attachment;filename=" + pdfname
          );
          res.setHeader("Content-Type", "application/pdf");
          res.send(buffer);
        }
      });

      await browser.close();
    })();
  } else {
    res.send("Invalid content: ");
  }
});

app.get("/pdfview/", function (req, res) {
  var urlToScreenshot = parseUrl(req.query.url);

  if (validUrl.isWebUri(urlToScreenshot)) {
    console.log("pdf: " + urlToScreenshot);
    (async () => {
      const browser = await puppeteer.launch({
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
        ],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 3072, height: 1469 });
      await page.goto(urlToScreenshot);
      await page.pdf({ format: "A4" }).then(function (buffer) {
        //res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.pdf"');
        res.setHeader("Content-Type", "application/pdf");
        res.send(buffer);
      });

      await browser.close();
    })();
  } else {
    res.send("Invalid url: " + urlToScreenshot);
  }
});

app.post("/location/", function (req, res) {
  console.log("request", req.body);
  res.send("Ok");
});

var CallAPIAsync = function (type, url, param, successcallback, errorcallback) {
  var options = {
    method: type,
    url: url,
    headers: { "Content-Type": "application/json" },
    body: param,
    json: true,
  };
  request(options, function (error, response, body) {
    if (error) {
      console.log("error", error);
      errorcallback(error);
    } else {
      successcallback(body);
    }
  });
};
app.get("/getice/", function (req, res) {
  CallAPIAsync(
    "PUT",
    "https://demo.xirsys.com/webrtc/_turn",
    {},
    function (d) {
      res.setHeader("Content-Type", "apllication/json");
      res.send(d);
    },
    function (err) {
      console.log(err);
      res.setHeader("Content-Type", "apllication/json");
      res.send("{}");
    }
  );
});

function GetImg(url, callback, room, ev) {
  // console.log(ev);
  var urlToScreenshot = parseUrl(url);

  if (validUrl.isWebUri(urlToScreenshot)) {
    // console.log('Screenshotting: ' + urlToScreenshot);
    (async () => {
      if (browsers[room] == null) {
        console.log("new browser opened");
        var mybrowser = await puppeteer.launch({
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--auto-select-desktop-capture-source=pickme",
            // '--autoplay-policy=user-gesture-required',
            "--disable-infobars",
            "--disable-extensions-except=" +
              __dirname +
              "/chrome-screen-rec-poc-master/chrome-screen-rec-poc-master/attempt1/src",
            "--load-extension=" +
              __dirname +
              "/chrome-screen-rec-poc-master/chrome-screen-rec-poc-master/attempt1/src",
          ],
          headless: true,
        });
        browsers[room] = { browser: mybrowser, page: [] };
      }
      var page = null;
      if (browsers[room].page.length == 0) {
        page = await browsers[room].browser.newPage();
        page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        );
        browsers[room].page.push(page);
        // page.on('load', () => console.log('Page loaded! ',page.url()));
        // page.on('request', () => console.log('Request for ',page.url()));
        page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
      } else {
        page = browsers[room].page[0];
        page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        );
      }
      if (ev.type == "goto") {
        if (urlToScreenshot.indexOf("web.whatsapp.com") != -1) {
          await page.setExtraHTTPHeaders({ referer: "https://www.google.com" });
        }
        page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        );
        await page.goto(urlToScreenshot);
        page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        );
        // await page.setViewport({width: 1536, height: 734});
        await page.setViewport({ width: 1280, height: 720 });
      }
      if (ev.type == "click") {
        await page.mouse.move(ev.data.x, ev.data.y);
        await page.mouse.down();
        await page.mouse.up();
      }
      if (ev.type == "typing") {
        // console.log('typing......',ev.data);
        // if(ev.data.key==8){
        //   await page.keyboard.down('Backspace');
        // }else{
        await page.keyboard.down(ev.data.key);
        await page.keyboard.up(ev.data.key);
        // }
      }
      if (ev.type == "scroll") {
        // console.log(ev.data);
        await page.evaluate((ev) => {
          window.scrollTo(ev.data[0], ev.data[1]);
        }, ev);
      }
      if (ev.type == "mousemove") {
        await page.mouse.move(ev.data.x, ev.data.y); // move to (100, 200) coordinates
        await page.evaluate(() => {
          if (document.getElementsByClassName("mouse-helper").length == 0) {
            const box = document.createElement("div");
            box.classList.add("mouse-helper");
            const styleElement = document.createElement("style");
            styleElement.innerHTML = `
                  .mouse-helper {
                    pointer-events: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: 10px;
                    margin-left: -10px;
                    margin-top: -10px;
                    transition: background .2s, border-radius .2s, border-color .2s;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 20px solid #2f2f2f;
                    transform: rotate(-20deg);
                    z-index:100000000000000000000;
                  }

                  .mouse-helper.button-1 {
                    transition: none;
                    background: rgba(0,0,0,0.9);
                  }
                  .mouse-helper.button-2 {
                    transition: none;
                    border-color: rgba(0,0,255,0.9);
                  }
                  .mouse-helper.button-3 {
                    transition: none;
                    border-radius: 4px;
                  }
                  .mouse-helper.button-4 {
                    transition: none;
                    border-color: rgba(255,0,0,0.9);
                  }
                  .mouse-helper.button-5 {
                    transition: none;
                    border-color: rgba(0,255,0,0.9);
                  }
                  `;
            document.head.appendChild(styleElement);
            document.body.appendChild(box);
            document.addEventListener(
              "mousemove",
              (event) => {
                box.style.left = event.pageX + "px";
                box.style.top = event.pageY + "px";
                //updateButtons(event.buttons);
              },
              true
            );
            document.addEventListener(
              "mousedown",
              (event) => {
                updateButtons(event.buttons);
                //box.classList.add('button-' + event.which);
              },
              true
            );
            document.addEventListener(
              "mouseup",
              (event) => {
                updateButtons(event.buttons);
                //box.classList.remove('button-' + event.which);
              },
              true
            );
            function updateButtons(buttons) {
              for (let i = 0; i < 5; i++)
                box.classList.toggle("button-" + i, buttons & (1 << i));
            }
          }
        });
      }
      var pageDimenesions = [1260, 700];
      try {
        const bodyHandle = (await page.$("html")) || (await page.$("body"));
        pageDimenesions = await page.evaluate(
          (body) => [body.scrollWidth, body.scrollHeight],
          bodyHandle
        );
        // console.log(pageDimenesions);
        await bodyHandle.dispose();
      } catch (ex) {}
      await page.evaluateOnNewDocument(() => {
        window.addEventListener("message", (event) => {
          // Only handle backend messages here
          if (!event.data.type || !event.data.type.startsWith("REC_BACKEND_"))
            return;
          switch (event.data.type) {
            case "REC_BACKEND_START":
              console.log("REC_BACKEND_START");
              break;
            case "REC_BACKEND_STOP":
              console.log("REC_BACKEND_STOP");
              break;
            case "REC_BACKEND_BLOB":
              console.log("REC_BACKEND_BLOB");
              break;
            default:
              console.log("Unrecognized message", event.data);
          }
        });
      });
      await page
        .screenshot({ type: "jpeg", quality: 50 })
        .then(function (buffer) {
          //res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
          //res.setHeader('Content-Type', 'image/png');
          callback(buffer, page.url(), pageDimenesions);
          //res.send(buffer)
        })
        .catch(function (ex) {
          console.log("::PAGE CLOSED::");
        });

      //await browser.close();
    })();
  } else {
    //res.send('Invalid url: ' + urlToScreenshot);
    callback("");
  }
}

var people = {};
var rooms = {};
var clients = [];
var browsers = {};

io.sockets.on("connection", function (socket) {
  // convenience function to log server messages on the client
  function log() {
    var array = ["Message from server:"];
    array.push.apply(array, arguments);
    socket.emit("log", array);
  }

  socket.on("message", function (message) {
    // log('Client said: ', message);
    // console.log(message.room);
    // console.log("all sockets: ",io.sockets.in(message.room));
    //io.sockets.in(message.room).emit('message', message.msg);
    // for a real app, would be room-only (not broadcast)
    //socket.broadcast.to(message.room).emit('message', message.msg);
    if ((message.type = "GetImg")) {
      // console.log(message);
      try {
        GetImg(
          message.url,
          function (imgmsg, currenturl, pageDimenesions) {
            io.sockets.in(message.room).emit("message", {
              buffer: imgmsg,
              type: "GetImg",
              currenturl: currenturl,
              pageDimenesions: pageDimenesions,
            });
          },
          message.room,
          message.ev
        );
      } catch (ex) {
        console.log("Excepton", ex);
      }
    } else {
      socket.broadcast.to(message.room).emit("message", message.msg);
    }
  });

  socket.on("create or join", function (room) {
    //log('Received request to create or join room ' + room);

    var numClients = io.sockets.sockets.length;
    //log('Room ' + room + ' now has ' + numClients + ' client(s)');
    console.log("Room " + room + " now has " + numClients + " client(s)");

    if (rooms[room]) {
      if (rooms[room].length == 2) {
        return false;
      }
      socket.join(room);
      log("Client ID " + socket.id + " joined room " + room);
      rooms[room].push(socket.id);
      people[socket.id] = room;
      socket.emit("joined", room, socket.id);
      //io.sockets.in(room).emit('ready', room);
      socket.broadcast.to(room).emit("ready", room);
      console.log(socket.id + " joined room " + room);
      console.log(rooms);
    } else {
      rooms[room] = [socket.id];
      // browsers[room]=null;
      people[socket.id] = room;
      socket.join(room);
      log("Client ID " + socket.id + " created room " + room);

      console.log(socket.id + " created room " + room);
      console.log(rooms);
      if (browsers[room]) {
        socket.emit("created", room, socket.id, "OldSession");
      } else {
        socket.emit("created", room, socket.id, "NewSession");
      }
    }

    // if (numClients === 1) {
    //   socket.join(room);
    //   log('Client ID ' + socket.id + ' created room ' + room);
    //   socket.emit('created', room, socket.id);
    // } else if (numClients >1) {
    //   log('Client ID ' + socket.id + ' joined room ' + room);
    //   // io.sockets.in(room).emit('join', room);
    //   socket.join(room);
    //   socket.emit('joined', room, socket.id);
    //   io.sockets.in(room).emit('ready', room);
    //   socket.broadcast.emit('ready', room);
    // } else { // max two clients
    //   socket.emit('full', room);
    // }
  });

  socket.on("filesaving", function (data) {
    fs.appendFile(data.fileName, data.fileData, function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  });
  socket.on("filestream", function (data) {
    // fs.appendFile(data.fileName, data.fileData, function (err) {
    //   if (err) throw err;
    //   console.log('Saved!');
    // });
    //console.log('stream received');
    socket.broadcast.to(data.room).emit("message", data);
  });

  socket.on("ipaddr", function () {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === "IPv4" && details.address !== "127.0.0.1") {
          socket.emit("ipaddr", details.address);
        }
      });
    }
  });

  socket.on("bye", function (message) {
    console.log("received bye ", message);
    try {
      var temproom = people[socket.id];
      delete rooms[temproom].splice(rooms[temproom].indexOf(socket.id), 1);
      if (rooms[temproom].length == 0) {
        delete rooms[temproom];
        if (browsers[temproom]) {
          //browsers[temproom].browser.close();
          //delete browsers[temproom];
        }
      }

      delete people[socket.id];
      io.sockets.in(temproom).emit("message", "bye");
      console.log("rooms ", rooms);
      console.log("people ", people);
      console.log(socket.id, " user disconnected");
    } catch (err) {
      // handle the error safely
      console.log(err);
    }
  });

  socket.on("disconnect", function () {
    try {
      var temproom = people[socket.id];
      delete rooms[temproom].splice(rooms[temproom].indexOf(socket.id), 1);
      if (rooms[temproom].length == 0) {
        delete rooms[temproom];
        if (browsers[temproom]) {
          //browsers[temproom].browser.close();
          //delete browsers[temproom];
        }
      }
      delete people[socket.id];
      socket.leave(temproom);
      io.sockets.in(temproom).emit("message", "bye");
      console.log("rooms ", rooms);
      console.log("people ", people);
      console.log(socket.id, " user disconnected");
    } catch (err) {
      // handle the error safely
      console.log(err);
    }
  });
});

function DownloadPdf(url, param, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function () {
    if (this.status === 200) {
      var filename = "";
      var disposition = xhr.getResponseHeader("Content-Disposition");
      if (disposition && disposition.indexOf("attachment") !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1])
          filename = matches[1].replace(/['"]/g, "");
      }
      var type = xhr.getResponseHeader("Content-Type");
      var blob =
        typeof File === "function"
          ? new File([this.response], filename, { type: type })
          : new Blob([this.response], { type: type });
      callback(blob);
    }
  };
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(param);
}

server.listen(port, function () {
  console.log("App listening on port " + port);
});
