const { ProxyFactory, reverseProxyFactory } = require('./ProxyFactory');

module.exports = {
  protect: ProxyFactory,
  release: reverseProxyFactory,
};
