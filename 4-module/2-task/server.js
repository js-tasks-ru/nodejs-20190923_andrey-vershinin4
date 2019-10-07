const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const FILES_DIR_NAME = 'files';
const FILES_DIR = path.join(__dirname, FILES_DIR_NAME);

const isCorrectDir = (pathname) => FILES_DIR === path.parse(pathname).dir;

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, FILES_DIR_NAME, pathname);

  switch (req.method) {
    case 'POST':

      if (!isCorrectDir(filepath)) {
        res.statusCode = 400;
        res.end('Wrong file name!');
        return;
      }

      const limit = new LimitSizeStream({limit: 1048576});
      const writer = fs.createWriteStream(filepath, {flags: 'wx'});

      req
          .pipe(limit)
          .pipe(writer);

      req
          .on('close', () => {
            if (!req.complete) {
              writer.destroy();
              fs.unlinkSync(filepath);
            }
          })
          .on('error', (err) => {
            res.statusCode = 500;
            res.end('Server error');
          });

      limit
          .on('error', (err) => {
            if (err.code === 'LIMIT_EXCEEDED') {
              res.statusCode = 413;
              res.end('Max size of file is exceeded.');
            } else {
              res.statusCode = 500;
              res.end('Server error');
            }
          });

      writer
          .on('close', () => {
            res.statusCode = 201;
            res.end(`${pathname} was created!.`);
          })
          .on('error', (err) => {
            if (err.code === 'EEXIST') {
              res.statusCode = 409;
              res.end(`${pathname} exists.`);
            } else {
              res.statusCode = 500;
              res.end('Server error.');
            }
          });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
