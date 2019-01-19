const Benchmark = require('benchmark');
const _ = require('lodash');
const alhambra = require('../dist/main');

/* Comparison to alternatives. */

const suite = new Benchmark.Suite();
const obj = { foo: { bar: { baz: {} } } };
const arr = Array(10e5).fill(obj);

suite
  .add('alhambra.protect()', function() {
    alhambra.protect(arr);
  })
  .add('_.cloneDeep()', function() {
    _.cloneDeep(arr);
  })
  .add('JSON.parse(JSON.stringify()', function() {
    JSON.parse(JSON.stringify(arr));
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();
