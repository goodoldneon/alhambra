const { isArray } = require('lodash');

const replaceChanged = (a, b) => {
  if (!isArray(a) || !isArray(b)) {
    throw new TypeError('Both arguments must be array.');
  }

  if (a.length !== b.length) {
    throw new Error('Both arrays must have the same length.');
  }

  return a.map((aItem, index) => {
    const bItem = b[index];

    if (aItem === bItem) return aItem;

    return bItem;
  });
};

module.exports = { replaceChanged };
