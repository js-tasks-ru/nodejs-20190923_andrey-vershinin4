const {StringDecoder} = require('string_decoder');
const stream = require('stream');
const {EOL} = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options = {}) {
    super(options);
    this._encoding = options.encoding || 'utf-8';
    this._decoder = new StringDecoder(this._encoding);
    this._str = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkStr = this._decoder.write(chunk);
    const currentStr = `${this._str}${chunkStr}`;

    if (currentStr.includes(EOL)) {
      const lines = currentStr.split(EOL);

      lines
          .slice(0, -1)
          .forEach((line) => this.push(line));

      this._str = lines.slice(-1)[0];
    } else {
      this._str = currentStr;
    }

    callback();
  }

  _flush(callback) {
    callback(null, this._str);
  }
}

module.exports = LineSplitStream;
