const alhambra = require('../src');

const obj = {
  id: 1,
  metadata: {
    name: 'aaa',
  },
  foo: {
    bar: {
      baz: 'aaa',
      arr: [1, 2, 3],
      objects: [{ a: 1 }, { a: 2 }, { a: 3 }],
    },
  },
  arr: [1, 2, 3],
};

const p = alhambra.protect(obj);

p.metadata.name = 'bbb';

const r = alhambra.release(p);

console.log(obj.metadata.name);
console.log(p.metadata.name);
console.log(r.metadata.name);
