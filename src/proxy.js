const clone = require('lodash/clone');
const has = require('lodash/has');
const isObject = require('lodash/isObject');

const { deepStripProxy } = require('./deepStripProxy');

class Handler {
  constructor({ original, requestDelete = null, requestSet = null, wrapWithProxy }) {
    this._internal = original;
    this._isChanged = false;
    this._isCloned = false;
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

    if (key === '__internal') {
      return this._isChanged ? deepStripProxy(this._internal) : this._original;
    }

    if (isObject(this._internal[key])) {
      const performDelete = (deleteTarget, targetKey) => {
        delete deleteTarget[targetKey];
        this._handleSet(key, deleteTarget);
      };

      const performSet = (setTarget, targetKey, value) => {
        const newSetTarget = clone(setTarget);

        newSetTarget[targetKey] = value;
        this._handleSet(key, newSetTarget);
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

  set(target, key, value) {
    this._handleSet(key, value);

    return true;
  }

  deleteProperty(target, key) {
    this._handleDelete(key);

    return true;
  }

  _handleSet(key, value) {
    if (!this._isCloned) this._cloneOriginal();

    if (this._requestSet) {
      this._requestSet(this._internal, key, value);
    } else {
      this._internal[key] = value;
    }

    this._notifyChange();
  }

  _handleDelete(key) {
    if (!this._isCloned) this._cloneOriginal();

    if (this._requestDelete) {
      this._requestDelete(this._internal, key);
    } else {
      delete this._internal[key];
    }

    this._notifyChange();
  }

  _notifyChange() {
    this._isChanged = true;
  }

  _cloneOriginal() {
    this._internal = clone(this._original);
    this._isCloned = true;
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
