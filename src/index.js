const { removeProxy, wrapWithProxy } = require('./proxy');

module.exports = {
  protect: (original) => wrapWithProxy({ original }),
  release: removeProxy,
};
