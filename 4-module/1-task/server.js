const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filesDir = path.join(__dirname, 'files');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      // pathname directory is not correct
      if (filesDir !== path.parse(filepath).dir) {
        res.statusCode = 400;
        res.end();
        return;
      }

      const stream = fs.createReadStream(filepath);
      stream.pipe(res);

      stream.on('error', (err) => {
        // file is not found
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
        } else { // unknown error
          res.statusCode = 500;
        }
        res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
