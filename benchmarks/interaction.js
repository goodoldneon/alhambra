const Benchmark = require('benchmark');
const _ = require('lodash');
const alhambra = require('../src/index');

const suite = new Benchmark.Suite();
const obj = { foo: { bar: { baz: {} } } };
const dummyProxy = new Proxy(obj, {});
const p = alhambra.protect(obj);

suite
  .add('original getter', function() {
    obj.foo;
  })
  .add('protected getter', function() {
    p.foo;
  })
  .add('Proxy getter', function() {
    dummyProxy.foo;
  })
  .add('original nested getter', function() {
    obj.foo.bar.baz;
  })
  .add('protected nested getter', function() {
    p.foo.bar.baz;
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();

console.log('\n');

/* Array of 1 million objects. */
const arr = Array(10e5).fill(obj);

(() => {
  const name = `cloneDeep() and iterate\n`;
  console.time(name);

  const clonedArr = _.cloneDeep(arr);
  clonedArr.forEach(() => {});

  console.timeEnd(name);
})();

(() => {
  const name = `protect() and iterate\n`;
  console.time(name);

  const protectedArr = alhambra.protect(arr);
  protectedArr.forEach(() => {});

  console.timeEnd(name);
})();

(() => {
  const name = `protect() and iterate (with getter in each iteration)\n`;
  console.time(name);

  const protectedArr = alhambra.protect(arr);
  protectedArr.forEach((item) => {
    item.foo;
  });

  console.timeEnd(name);
})();

(() => {
  const name = `cloneDeep() and one getter\n`;
  console.time(name);

  const clonedArr = _.cloneDeep(arr);
  clonedArr[0];

  console.timeEnd(name);
})();

(() => {
  const name = `protect() and one getter\n`;
  console.time(name);

  const protectedArr = alhambra.protect(arr);
  protectedArr[0];

  console.timeEnd(name);
})();

(() => {
  const name = `protect() and one nested getter\n`;
  console.time(name);

  const protectedArr = alhambra.protect(arr);
  protectedArr[0].foo.bar;

  console.timeEnd(name);
})();
