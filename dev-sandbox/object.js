const alhambra = require('../src');

const obj = {
  foo: {
    bar: {
      items: [{ a: 1 }, { a: 2 }, { a: 3 }],
    },
  },
};

const p = alhambra.protect(obj);

p.foo.bar.items[1].a = 100;

const reversed = alhambra.release(p);

console.log(reversed.foo.bar.items[0] === obj.foo.bar.items[0]); // True
console.log(reversed.foo.bar.items[1] === obj.foo.bar.items[1]); // False
console.log(reversed.foo.bar.items[2] === obj.foo.bar.items[2]); // True

// console.log('\n');
// console.log(p.foo);

// expect(p.foo.bar.baz).toBe(undefined);
// expect(reversed.foo.bar.baz).toBe(undefined);
