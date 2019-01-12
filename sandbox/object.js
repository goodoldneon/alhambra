const alhambra = require('../src');

const obj = {
  id: 1,
  metadata: {
    name: 'foo',
  },
  foo: {
    bar: {
      baz: 'aaa',
    },
  },
};

const p = alhambra.protect(obj);

p.foo.bar.baz = 'bbb';
console.log(obj.foo.bar.baz, p.foo.bar.baz, p.__copy.foo.bar.baz);
p.metadata.name = 'bar';
console.log(obj.metadata.name, p.metadata.name, p.__copy.metadata.name);
