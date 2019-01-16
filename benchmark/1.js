const immutable = require('immutable');
const _ = require('lodash');

const alhambra = require('../src');
const { runBenchmark } = require('./index');

const obj = { foo: { bar: { baz: {} } } };
const arrLength = 10e4;
const arr = Array(arrLength).fill(obj);

runBenchmark(
  () => {
    arr.forEach((item) => {
      immutable.fromJS(item);
    });
  },
  {
    ignoreFirstJobInRun: true,
    runCount: 5,
    title: `${arrLength} iterations -- immutable.fromJS()`,
  },
);

runBenchmark(
  () => {
    immutable.fromJS(arr);
  },
  {
    ignoreFirstJobInRun: true,
    runCount: 5,
    title: `${arrLength} length array of objects into immutable.fromJS()`,
  },
);

runBenchmark(
  () => {
    arr.forEach((item) => {
      _.cloneDeep(item);
    });
  },
  {
    ignoreFirstJobInRun: true,
    runCount: 5,
    title: `${arrLength} iterations -- _.cloneDeep()`,
  },
);

runBenchmark(
  () => {
    arr.forEach((item) => {
      alhambra.protect(item);
    });
  },
  {
    ignoreFirstJobInRun: true,
    runCount: 5,
    title: `${arrLength} iterations -- alhambra.protect()`,
  },
);

runBenchmark(
  () => {
    const p = alhambra.protect(arr);

    p.forEach(() => {});
  },
  {
    ignoreFirstJobInRun: true,
    runCount: 5,
    title: `${arrLength} iterations -- alhambra.protect().forEach()`,
  },
);

runBenchmark(
  () => {
    const p = new Proxy(arr, { get() {} });

    arr.forEach((item, index) => {
      _.clone(item);
      p[index];
    });
  },
  {
    ignoreFirstJobInRun: true,
    runCount: 5,
    title: `${arrLength} iterations -- _.clone() and Proxy.get()`,
  },
);

runBenchmark(
  () => {
    const p = new Proxy(arr, { get() {} });

    arr.forEach((item, index) => {
      p[index];
    });
  },
  { ignoreFirstJobInRun: true, runCount: 5, title: `${arrLength} iterations -- Proxy.get()` },
);

runBenchmark(
  () => {
    arr.forEach((item) => {
      new Proxy(arr, { get() {} });
    });
  },
  { ignoreFirstJobInRun: true, runCount: 5, title: `${arrLength} iterations -- new Proxy()` },
);

runBenchmark(
  () => {
    arr.forEach(() => {});
  },
  { ignoreFirstJobInRun: true, runCount: 5, title: `${arrLength} iterations` },
);
