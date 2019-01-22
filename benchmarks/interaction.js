const Benchmark = require('benchmark');
const immer = require('immer');
const _ = require('lodash');
const alhambra = require('../src/index');

const suite = new Benchmark.Suite();
const obj = { foo: { bar: { baz: {} } } };

/* Array of 1 million objects. */
const arr = Array(10e5).fill(obj);

const dummyProxy = new Proxy(arr, {});
const p = alhambra.protect(arr);

suite
  .add('original getter', function() {
    arr[0];
  })
  .add('protected getter', function() {
    p[0];
  })
  .add('Proxy getter', function() {
    dummyProxy[0];
  })
  .add('original nested getter', function() {
    arr[0].foo.bar.baz;
  })
  .add('protected nested getter', function() {
    p[0].foo.bar.baz;
  })
  .add('immer nested getter', function() {
    immer.produce(arr, (draftState) => {
      draftState[0].foo.bar.baz;
    });
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();

console.log('\n');

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
  const name = `immer.produce() and iterate\n`;
  console.time(name);

  immer.produce(arr, (draftState) => {
    draftState.forEach((item) => {
      item.foo;
    });
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

(() => {
  const name = `immer.produce() and one nested getter\n`;
  console.time(name);

  immer.produce(arr, (draftState) => {
    draftState[0].foo.bar;
  });

  console.timeEnd(name);
})();
