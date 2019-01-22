const Benchmark = require('benchmark');
const immer = require('immer');
const _ = require('lodash');
const alhambra = require('../dist/main');

/* Comparison to alternatives. */

const suite = new Benchmark.Suite();
const obj = { foo: { bar: { baz: {} } } };
const arr = Array(10e5).fill(obj);

suite
  .add('mutate', function() {
    obj.foo.bar.baz = 2;
  })
  .add('spread', function() {
    const newObj = {
      ...obj,
      foo: {
        ...obj.foo,
        bar: {
          ...obj.foo.bar,
          baz: 2,
        },
      },
    };
  })
  .add('alhambra.protect()', function() {
    const p = alhambra.protect(obj);

    p.foo.bar.baz = 2;

    alhambra.release(p);
  })
  .add('immer.produce()', function() {
    immer.produce(obj, (draftState) => {
      draftState.foo.bar.baz;
    });
  })
  // .add('alhambra.protect()', function() {
  //   alhambra.protect(arr);
  // })
  // .add('_.cloneDeep()', function() {
  //   _.cloneDeep(arr);
  // })
  // .add('immer.produce()', function() {
  //   immer.produce(obj, () => {});
  // })
  // .add('JSON.parse(JSON.stringify()', function() {
  //   JSON.parse(JSON.stringify(arr));
  // })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();
