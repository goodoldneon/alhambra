const { ProxyFactory } = require('./ProxyFactory');
const { reverseProxyFactory } = require('./reverseProxyFactory');

module.exports = {
  protect: ProxyFactory,
  release: reverseProxyFactory,
};
