const { wrapWithProxy } = require('./proxy');
const { removeProxy } = require('./removeProxy');

module.exports = {
  protect: (original) => wrapWithProxy({ original }),
  release: removeProxy,
};
