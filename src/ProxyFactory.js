const { clone, has, isObject } = require('lodash');

/**
 * Removes the Proxies.
 * Recursive.
 *
 * @param {Array|Object} target - Proxy-wrapped object.
 * @returns {Array|Object} - "target", but stripped of Proxy-wrapping.
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
 * @param {Array|Object} original - What to wrap the Proxy around.
 * @param {Array|Object} [onChange] - Callback to parent scope to notify about a change. Used to tell root that one of its properties (any depth) changed. Should only be used with recursion, and not passed in the original call.
 * @param {Array|Object} [requestSet] - Callback to parent scope to set a property. Should only be used with recursion, and not passed in the original call.
 * @param {Array|Object} [requestDelete] - Callback to parent scope to delete a property. Should only be used with recursion, and not passed in the original call.
 * @returns {Array|Object} - Proxy-wrapped object. If "original" is not an object, then this is the same as "original".
 */
const ProxyFactory = ({
  original,
  onChange = () => {},
  requestSet = null,
  requestDelete = null,
}) => {
  let internal;
  let isChanged = false;

  const handleChange = () => {
    isChanged = true;
    onChange();
  };

  const deleteProperty = (obj, key, value) => {
    if (requestDelete) {
      requestDelete(obj, key, value);
    } else {
      obj[key] = value;
    }

    handleChange();
  };

  const set = (obj, key, value) => {
    if (requestSet) {
      requestSet(obj, key, value);
    } else {
      obj[key] = value;
    }

    handleChange();
  };

  const handler = {
    deleteProperty: function(target, key) {
      deleteProperty(target, key);

      return true;
    },
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
          const performDelete = (target, targetKey) => {
            delete target[targetKey];
            set(internal, key, target);
          };

          const performSet = (target, targetKey, value) => {
            target[targetKey] = value;
            set(internal, key, target);
          };

          return ProxyFactory({
            original: internal[key],
            onChange: handleChange,
            requestDelete: performDelete,
            requestSet: performSet,
          });
        }

        return target[key];
      }

      return target[key];
    },
    set: function(target, key, value) {
      set(target, key, value);

      return true;
    },
  };

  if (isObject(original)) {
    internal = clone(original);
  } else {
    return original; // Must be a primitive.
  }

  return new Proxy(internal, handler);
};

module.exports = { ProxyFactory };
