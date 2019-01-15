const clone = require('lodash/clone');
const has = require('lodash/has');
const isObject = require('lodash/isObject');

const { deepStripProxy } = require('./deepStripProxy');

class Handler {
  constructor({ original, requestDelete = null, requestSet = null, wrapWithProxy }) {
    this._internal = null;
    this._isChanged = false;
    this._original = original;
    this._requestDelete = requestDelete;
    this._requestSet = requestSet;
    this._wrapWithProxy = wrapWithProxy;
  }

  get(target, key) {
    if (key === '__isChanged') {
      return this._isChanged;
    }

    if (key === '__isProxy') {
      return true;
    }

    /* Lazy clone original. */
    if (!this._internal) this._internal = clone(this._original);

    if (key === '__internal') {
      return this._isChanged ? deepStripProxy(this._internal) : this._original;
    }

    if (has(target, key)) {
      if (isObject(target[key])) {
        const performDelete = (deleteTarget, targetKey) => {
          const newDeleteTarget = clone(deleteTarget);

          delete newDeleteTarget[targetKey];
          this._handleSet(this._internal, key, newDeleteTarget);
        };

        const performSet = (setTarget, targetKey, value) => {
          const newSetTarget = clone(setTarget);

          newSetTarget[targetKey] = value;
          this._handleSet(this._internal, key, newSetTarget);
        };

        return this._wrapWithProxy({
          original: this._internal[key],
          onChange: this.notifyChange,
          requestDelete: performDelete,
          requestSet: performSet,
        });
      }

      return this._internal[key];
    }

    /* Should only be for prototype chain. */
    return target[key];
  }

  set(target, key, value) {
    /* Lazy clone original. */
    if (!this._internal) this._internal = clone(this._original);

    this._handleSet(this._internal, key, value);

    return true;
  }

  deleteProperty(target, key) {
    this._handleDelete(target, key);

    return true;
  }

  _handleSet(obj, key, value) {
    if (this._requestSet) {
      this._requestSet(obj, key, value);
    } else {
      obj[key] = value;
    }

    this._notifyChange();
  }

  _handleDelete(obj, key, value) {
    if (this._requestDelete) {
      this._requestDelete(obj, key, value);
    } else {
      obj[key] = value;
    }

    this._notifyChange();
  }

  _notifyChange() {
    this._isChanged = true;
  }
}

/**
 * Wraps a Proxy around the input.
 * Recursive.
 *
 * @param {Array|Object} original - What to wrap the Proxy around.
 * @param {Function} [requestSet] - Callback to parent scope to set a property. Should only be used with recursion, and not passed in the original call.
 * @param {Function} [requestDelete] - Callback to parent scope to delete a property. Should only be used with recursion, and not passed in the original call.
 * @param {Function} [wrapWithProxy] - For recursion.
 * @returns {Array|Object} - Proxy-wrapped object. If "original" is not an object, then this is the same as "original".
 */
const wrapWithProxy = ({ original, requestDelete = null, requestSet = null }) => {
  const handler = new Handler({
    original,
    requestDelete,
    requestSet,
    wrapWithProxy,
  });

  /* No need to wrap primitives. */
  if (!isObject(original)) {
    return original;
  }

  return new Proxy(original, handler);
};

module.exports = { wrapWithProxy };
