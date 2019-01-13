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
      const newTarget = target.__internal;

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
const ProxyFactory = ({ original, onChange = () => {}, requestChange = null }) => {
  let internal;
  let handler;
  let isChanged = false;

  const handleChange = () => {
    // console.log(internal);
    isChanged = true;
    onChange();
  };

  const updateObject = (obj, key, value) => {
    if (requestChange) {
      requestChange(obj, key, value);
    } else {
      obj[key] = value;
    }

    handleChange();
  };

  const arrayHandler = {
    get: function(target, key) {
      if (key === '__internal') {
        return isChanged ? deepStripProxies(internal) : original;
      }

      if (key === '__isChanged') {
        return isChanged;
      }

      if (key === '__isProxy') {
        return true;
      }

      if (has(target, key)) {
        if (isObject(target[key])) {
          const performChange = (target, targetKey, value) => {
            target[targetKey] = value;
            updateObject(internal, key, target);
            handleChange();
          };

          return ProxyFactory({
            original: internal[key],
            onChange: handleChange,
            requestChange: performChange,
          });
        }

        return target[key];
      }

      return Reflect.get(target, key) || Reflect.get(Array.prototype, key);
    },
    set: function(target, key, value) {
      updateObject(target, key, value);

      return true;
    },
  };

  const objectHandler = {
    deleteProperty: function(target, key) {
      delete target[key];

      handleChange();
    },
    get: function(target, key) {
      // console.log('\nget', target, key);
      if (key === '__internal') {
        return isChanged ? deepStripProxies(internal) : original;
      }

      if (key === '__isChanged') {
        return isChanged;
      }

      if (key === '__isProxy') {
        return true;
      }

      if (has(target, key)) {
        if (isObject(target[key])) {
          const performChange = (target, targetKey, value) => {
            target[targetKey] = value;
            updateObject(internal, key, target);
            handleChange();
          };

          return ProxyFactory({
            original: internal[key],
            onChange: handleChange,
            requestChange: performChange,
          });
        }

        return target[key];
      }

      return Reflect.get(target, key) || Reflect.get(Object.prototype, key);
    },
    set: function(target, key, value) {
      updateObject(target, key, value);

      return true;
    },
  };

  if (isArray(original)) {
    internal = clone(original);
    handler = arrayHandler;
  } else if (isObject(original)) {
    internal = clone(original);
    handler = objectHandler;
  } else {
    return original; // Must be a primitive.
  }

  return new Proxy(internal, handler);
};

module.exports = { ProxyFactory };
