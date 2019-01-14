const { wrapWithProxy } = require('./ProxyFactory');
const { reverseProxyFactory } = require('./reverseProxyFactory');

module.exports = {
  protect: (original) => wrapWithProxy({ original }),
  release: reverseProxyFactory,
};
