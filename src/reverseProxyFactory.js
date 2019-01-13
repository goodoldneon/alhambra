const reverseProxyFactory = (target) => {
  if (typeof target !== 'object' || target === null || target === undefined) {
    return target;
  }

  if (!target.__isProxy) {
    throw new TypeError("Cannot release something that wasn't protected first");
  }

  return target.__copy;
};

module.exports = { reverseProxyFactory };
