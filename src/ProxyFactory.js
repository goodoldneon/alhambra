const { clone, has, isObject } = require('lodash');

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
const wrapWithProxy = ({
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
      /* Lazy clone original. */
      if (!internal) internal = clone(original);

      if (key === '__internal') {
        return isChanged ? deepStripProxy(internal) : original;
      }

      if (key === '__isChanged') {
        return isChanged;
      }

      if (key === '__isProxy') {
        return true;
      }

      if (has(target, key)) {
        if (isObject(target[key])) {
          const performDelete = (deleteTarget, targetKey) => {
            const newDeleteTarget = clone(deleteTarget);

            delete newDeleteTarget[targetKey];
            set(internal, key, newDeleteTarget);
          };

          const performSet = (setTarget, targetKey, value) => {
            const newSetTarget = clone(setTarget);

            newSetTarget[targetKey] = value;
            set(internal, key, newSetTarget);
          };

          return wrapWithProxy({
            original: internal[key],
            onChange: handleChange,
            requestDelete: performDelete,
            requestSet: performSet,
          });
        }

        return internal[key];
      }

      /* Should only be for prototype chain. */
      return target[key];
    },
    set: function(target, key, value) {
      /* Lazy clone original. */
      if (!internal) internal = clone(original);

      set(internal, key, value);

      return true;
    },
  };

  if (isObject(original)) {
    // internal = clone(original);
  } else {
    return original; // Must be a primitive.
  }

  // return new Proxy(internal, handler);
  return new Proxy(original, handler);
};

module.exports = { wrapWithProxy };
