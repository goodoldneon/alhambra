const { protect } = require('../src');
const { ProxyFactory } = require('../src/ProxyFactory');
const { reverseProxyFactory } = require('../src/reverseProxyFactory');

it("Primitives don't need protection, but makes sure they don't error.", () => {
  const foo = 1;
  const p = protect(foo);
  const sameFoo = reverseProxyFactory(p);
  
  expect(foo).toEqual(sameFoo);
});

it("null doesn't need protection, but makes sure it doesn't error.", () => {
  const p = protect(null);
  const reverse = reverseProxyFactory(p);

  expect(reverse).toEqual(null);
});

it("undefined doesn't need protection, but makes sure it doesn't error.", () => {
  const p = protect(undefined);
  const reverse = reverseProxyFactory(p);

  expect(reverse).toEqual(undefined);
});
