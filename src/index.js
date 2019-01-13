const { ProxyFactory } = require('./ProxyFactory');
const { replaceChanged } = require('./replaceChanged');
const { reverseProxyFactory } = require('./reverseProxyFactory');

module.exports = {
  protect: (original) => ProxyFactory({ original }),
  release: reverseProxyFactory,
  replaceChanged,
};
