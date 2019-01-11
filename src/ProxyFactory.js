const { isObject } = require('lodash');

const ProxyFactory = (sourceObj) => {
  const newObj = {
    ...sourceObj,
    __isChanged: false,
  };

  newObj.self = newObj;

  const handler = {
    get: function(obj, prop) {
      if (prop === '__target') {
        return newObj.__isChanged ? newObj : sourceObj;
      }

      if (isObject(obj[prop])) {
        newObj.self[prop] = { ...obj[prop] };

        newObj.self = newObj.self[prop];

        return new Proxy(newObj.self, handler);
      }

      return obj[prop];
    },
    set: function(obj, prop, value) {
      obj[prop] = value;
      newObj.__isChanged = true;
    },
  };

  return new Proxy(newObj, handler);
};

module.exports = { ProxyFactory };
