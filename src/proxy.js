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

class Handler {
  constructor({ original, requestDelete = null, requestSet = null, wrapWithProxy }) {
    this.internal = null;
    this.isChanged = false;
    this.original = original;
    this.requestDelete = requestDelete;
    this.requestSet = requestSet;
    this.wrapWithProxy = wrapWithProxy;
  }

  get(target, key) {
    /* Lazy clone original. */
    if (!this.internal) this.internal = clone(this.original);

    if (key === '__internal') {
      return this.isChanged ? deepStripProxy(this.internal) : this.original;
    }

    if (key === '__isChanged') {
      return this.isChanged;
    }

    if (key === '__isProxy') {
      return true;
    }

    if (has(target, key)) {
      if (isObject(target[key])) {
        const performDelete = (deleteTarget, targetKey) => {
          const newDeleteTarget = clone(deleteTarget);

          delete newDeleteTarget[targetKey];
          this.handleSet(this.internal, key, newDeleteTarget);
        };

        const performSet = (setTarget, targetKey, value) => {
          const newSetTarget = clone(setTarget);

          newSetTarget[targetKey] = value;
          this.handleSet(this.internal, key, newSetTarget);
        };

        return this.wrapWithProxy({
          original: this.internal[key],
          onChange: this.notifyChange,
          requestDelete: performDelete,
          requestSet: performSet,
        });
      }

      return this.internal[key];
    }

    /* Should only be for prototype chain. */
    return target[key];
  }

  set(target, key, value) {
    /* Lazy clone original. */
    if (!this.internal) this.internal = clone(this.original);

    this.handleSet(this.internal, key, value);

    return true;
  }

  deleteProperty(target, key) {
    this.handleDelete(target, key);

    return true;
  }

  handleSet(obj, key, value) {
    if (this.requestSet) {
      this.requestSet(obj, key, value);
    } else {
      obj[key] = value;
    }

    this.notifyChange();
  }

  handleDelete(obj, key, value) {
    if (this.requestDelete) {
      this.requestDelete(obj, key, value);
    } else {
      obj[key] = value;
    }

    this.notifyChange();
  }

  notifyChange() {
    this.isChanged = true;
  }
}

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
const wrapWithProxy = ({ original, requestDelete = null, requestSet = null }) => {
  const handler = new Handler({
    original,
    requestDelete,
    requestSet,
    wrapWithProxy,
  });

  if (!isObject(original)) {
    return original; // Must be a primitive.
  }

  // return new Proxy(internal, handler);
  return new Proxy(original, handler);
};

const removeProxy = (target) => {
  if (typeof target !== 'object' || target === null || target === undefined) {
    return target;
  }

  if (!target.__isProxy) {
    throw new TypeError("Cannot release something that wasn't protected first");
  }

  return target.__internal;
};

module.exports = { removeProxy, wrapWithProxy };
