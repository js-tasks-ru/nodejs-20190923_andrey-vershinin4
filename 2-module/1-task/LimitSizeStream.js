const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options = {}) {
    super(options);

    this._limit = options.limit || null;
    this._size = 0;
  }


  _transform(chunk, encoding, callback) {
    this._size += chunk.length;

    if (this._limit && this._size > this._limit) {
      callback(new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
