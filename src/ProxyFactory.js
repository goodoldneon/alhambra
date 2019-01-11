const { isObject } = require('lodash');

const ProxyFactory = (original) => {
  let isChanged = false;
  const copy = { ...original };
  let traverser = copy;

  const handler = {
    get: function(target, prop) {
      if (prop === '__copy') {
        return isChanged ? copy : original;
      }

      if (isObject(target[prop])) {
        traverser[prop] = { ...target[prop] };

        traverser = traverser[prop];

        return new Proxy(traverser, handler);
      }

      return target[prop];
    },
    set: function(target, prop, value) {
      target[prop] = value;
      isChanged = true;
    },
  };

  return new Proxy(copy, handler);
};

module.exports = { ProxyFactory };
