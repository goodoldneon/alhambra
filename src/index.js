const { ProxyFactory } = require('./ProxyFactory');

module.exports = {
  protect: ProxyFactory,
  release: (target) => {
    if (typeof target !== 'object' || !target.__isProxy) {
      throw new TypeError("Cannot release something that wasn't protected first");
    }

    return target.__copy;
  },
};
