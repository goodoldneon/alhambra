const { ProxyFactory } = require('./ProxyFactory');
const { reverseProxyFactory } = require('./reverseProxyFactory');

module.exports = {
  protect: (original) => ProxyFactory({ original }),
  release: reverseProxyFactory,
};
