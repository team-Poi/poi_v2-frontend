const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

var baseAddress = parseInt(process.env.PORT || "3000");
var redirectAddress = baseAddress + 1;
var httpsAddress = baseAddress + 2;

app.prepare().then(() => {
  const https = require("https");
  const http = require("http");
  const net = require("net");
  const fs = require("fs");

  const options = {
    key: fs.readFileSync("/Users/oeinter/Documents/ssl/private.key"),
    cert: fs.readFileSync("/Users/oeinter/Documents/ssl/certificate.crt"),
  };
  net.createServer(tcpConnection).listen(baseAddress);
  http.createServer(httpConnection).listen(redirectAddress);

  function tcpConnection(conn) {
    conn.once("data", function (buf) {
      // A TLS handshake record starts with byte 22.
      var address = buf[0] === 22 ? httpsAddress : redirectAddress;
      var proxy = net.createConnection(address, function () {
        proxy.write(buf);
        conn.pipe(proxy).pipe(conn);
      });
    });
  }

  function httpConnection(req, res) {
    var host = req.headers["host"];
    res.writeHead(301, { Location: "https://" + host + req.url });
    res.end();
  }

  https
    .createServer(options, function (req, res) {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(httpsAddress, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${httpsAddress}`);
    });
});
