const isObject = require('lodash/isObject');

/**
 * Removes the Proxies.
 * Recursive.
 *
 * @param {Array|Object} target - Proxy-wrapped object.
 * @returns {Array|Object} - "target", but stripped of Proxy-wrapping.
 */
const deepStripProxy = (target) => {
  if (isObject(target)) {
    if (target.__isProxy) {
      const newTarget = target.__internal;

      Object.entries(newTarget).forEach(([key, value]) => {
        newTarget[key] = deepStripProxy(value);
      });

      return newTarget;
    }
  }

  return target;
};

module.exports = { deepStripProxy };
