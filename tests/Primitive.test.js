const { protect, release } = require('../src');

it("Primitives don't need protection, but makes sure they don't error.", () => {
  const foo = 1;
  const p = protect(foo);
  const r = release(p);

  expect(foo).toEqual(r);
});

it("null doesn't need protection, but makes sure it doesn't error.", () => {
  const p = protect(null);
  const r = release(p);

  expect(r).toEqual(null);
});

it("undefined doesn't need protection, but makes sure it doesn't error.", () => {
  const p = protect(undefined);
  const r = release(p);

  expect(r).toEqual(undefined);
});
