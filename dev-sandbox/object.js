const alhambra = require('../src');

const obj = {
  id: 1,
  metadata: {
    name: 'foo',
  },
  foo: {
    bar: {
      baz: 'aaa',
      items: [1, 2, 3],
    },
  },
  items: [1, 2, 3],
};

const p = alhambra.protect(obj);

delete p.foo.bar;

// const reversed = release(p);

console.log('\n');
console.log(p.foo);

// expect(p.foo.bar.baz).toBe(undefined);
// expect(reversed.foo.bar.baz).toBe(undefined);
