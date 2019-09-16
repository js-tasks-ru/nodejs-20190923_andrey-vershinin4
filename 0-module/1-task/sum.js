function sum(a, b) {
  /* ваш код */
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError();
  }

  return a + b;
}

module.exports = sum;
