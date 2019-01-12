const { has, isArray, isObject } = require('lodash');

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

const ProxyFactory = (original, onChange = () => {}) => {
  // console.log('');
  // console.log(original);
  let copy;
  let handler;
  let isChanged = false;

  const handleChange = () => {
    isChanged = true;
    onChange();
  };

  const objectHandler = {
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

  if (isArray(original)) {
    // copy = [...original];
    // handler = arrayHandler;
  } else if (isObject(original)) {
    copy = { ...original };
    handler = objectHandler;
  }

  // let traverser = copy;

  return new Proxy(copy, handler);
};

module.exports = { ProxyFactory };
