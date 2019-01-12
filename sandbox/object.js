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

// p.foo.bar.baz = 'bbb';
// console.log(obj.foo.bar.baz, p.foo.bar.baz, p.__copy.foo.bar.baz);
// p.metadata.name = 'bar';
// delete p.metadata.name;
// console.log(obj.metadata.name, p.metadata.name, p.__copy.metadata.name, obj === p.__copy);
// p.id = 2;
// console.log(obj.id, p.id, p.__copy.id);
// p.items.push(100);
// console.log(obj.items, p.items, p.__copy.items);
p.items.push(100);
console.log(obj.items, p.items, p.__copy.items);
// console.log(obj.foo.bar.items, p.foo.bar.items, p.__copy.foo.bar.items);
