const { ProxyFactory, reverseProxyFactory } = require('../src/ProxyFactory');

it("Primitives don't need protection, but makes sure they don't error.", () => {
  const foo = 1;
  const p = ProxyFactory(foo);
  const sameFoo = reverseProxyFactory(p);

  expect(foo).toEqual(sameFoo);
});

it("null doesn't need protection, but makes sure it doesn't error.", () => {
  const p = ProxyFactory(null);
  const reverse = reverseProxyFactory(p);

  expect(reverse).toEqual(null);
});


it("undefined doesn't need protection, but makes sure it doesn't error.", () => {
    const p = ProxyFactory(undefined);
    const reverse = reverseProxyFactory(p);
  
    expect(reverse).toEqual(undefined);
  });
  