const { has, isArray, isObject } = require('lodash');

const ProxyFactory = (original) => {
  let copy;
  let handler;
  let isChanged = false;

  const arrayHandler = {
    get: function(target, key) {
      if (key === '__copy') {
        return isChanged ? copy : original;
      }

      if (has(target, key)) {
        if (isObject(target[key])) {
          traverser[key] = { ...target[key] };

          traverser = traverser[key];

          return new Proxy(traverser, objectHandler);
        }

        return target[key];
      }

      return Reflect.get(target, key) || Reflect.get(Array.prototype, key);
    },
    set: function(target, key, value) {
      target[key] = value;
      isChanged = true;

      return true;
    },
  };

  const objectHandler = {
    get: function(target, key) {
      if (key === '__copy') {
        return isChanged ? copy : original;
      }

      if (has(target, key)) {
        if (isObject(target[key])) {
          traverser[key] = { ...target[key] };

          traverser = traverser[key];

          return new Proxy(traverser, objectHandler);
        }

        return target[key];
      }

      return Reflect.get(target, key) || Reflect.get(Array.prototype, key);
    },
    set: function(target, key, value) {
      target[key] = value;
      isChanged = true;

      return true;
    },
  };

  if (isArray(original)) {
    copy = [...original];
    handler = arrayHandler;
  } else if (isObject(original)) {
    copy = { ...original };
    handler = objectHandler;
  }

  let traverser = copy;

  return new Proxy(copy, handler);
};

module.exports = { ProxyFactory };
