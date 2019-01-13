const { clone, has, isArray, isObject } = require('lodash');

/**
 * Recursively removes the Proxies.
 *
 * @param {Array|Object} target
 * @returns {Array|Object}
 */
const deepStripProxies = (target) => {
  if (isObject(target)) {
    if (target.__isProxy) {
      const newTarget = target.__copy;

      Object.entries(newTarget).forEach(([key, value]) => {
        newTarget[key] = deepStripProxies(value);
      });

      return newTarget;
    }
  }

  return target;
};

/**
 * Wraps a Proxy around the input.
 * Recursive.
 *
 * @param {Array|Object} target
 * @param {Array|Object} [onChange] - Callback to parent to notify about a change. Used to tell root that one of its properties (any depth) changed.
 * @returns {Array|Object}
 */
const ProxyFactory = (original, onChange = () => {}) => {
  let copy;
  let handler;
  let isChanged = false;

  const handleChange = () => {
    isChanged = true;
    onChange();
  };

  const arrayHandler = {
    get: function(target, key) {
      if (key === '__copy') {
        return isChanged ? deepStripProxies(copy) : original;
      }

      if (key === '__isChanged') {
        return isChanged;
      }

      if (key === '__isProxy') {
        return true;
      }

      if (has(target, key)) {
        if (isObject(target[key])) {
          copy[key] = ProxyFactory(copy[key], handleChange);

          return copy[key];
        }

        return target[key];
      }

      return Reflect.get(target, key) || Reflect.get(Array.prototype, key);
    },
    set: function(target, key, value) {
      target[key] = value;
      isChanged = true;
      onChange();

      return true;
    },
  };

  const objectHandler = {
    deleteProperty: function(target, key) {
      delete target[key];
      isChanged = true;
      onChange();
    },
    get: function(target, key) {
      if (key === '__copy') {
        return isChanged ? deepStripProxies(copy) : original;
      }

      if (key === '__isChanged') {
        return isChanged;
      }

      if (key === '__isProxy') {
        return true;
      }

      if (has(target, key)) {
        if (isObject(target[key])) {
          copy[key] = ProxyFactory(copy[key], handleChange);

          return copy[key];
        }

        return target[key];
      }

      return Reflect.get(target, key) || Reflect.get(Object.prototype, key);
    },
    set: function(target, key, value) {
      target[key] = value;
      isChanged = true;
      onChange();

      return true;
    },
  };

  if (isArray(original)) {
    copy = clone(original);
    handler = arrayHandler;
  } else if (isObject(original)) {
    copy = clone(original);
    handler = objectHandler;
  } else {
    return original; // Must be a primitive.
  }

  return new Proxy(copy, handler);
};

module.exports = { ProxyFactory };
