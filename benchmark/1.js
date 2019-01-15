const immutable = require('immutable');
const _ = require('lodash');

const alhambra = require('../src');
const { protect } = require('../');
const { runBenchmark } = require('./index');

const arrLength = 10e5;
const arr = Array(arrLength).fill({});
let title;
let job;

title = `${arrLength} length array -- Iterate and assign`;

job = () => {
  arr.forEach((item) => {
    const foo = item;
  });
};

runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 20, runCount: 1, title });

title = `${arrLength} length array -- Iterate and spread`;

job = () => {
  arr.forEach((item) => {
    const foo = { ...item };
  });
};

runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 20, runCount: 1, title });

title = `${arrLength} length array -- Iterate and Proxy`;

job = () => {
  arr.forEach((item) => {
    const foo = new Proxy(item, () => {});
  });
};

runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 20, runCount: 1, title });

// title = `${arrLength} length array -- Iterate and immutable.fromJS()`;

// job = () => {
//   arr.forEach((item) => {
//     const foo = immutable.fromJS(item);
//   });
// };

// runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 20, runCount: 1, title });

// title = `${arrLength} length array -- Iterate and _.cloneDeep()`;

// job = () => {
//   arr.forEach((item) => {
//     const foo = _.cloneDeep(item);
//   });
// };

// runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 20, runCount: 1, title });

title = `${arrLength} length array -- Iterate and alhambra.protect()`;

job = () => {
  arr.forEach((item) => {
    const foo = alhambra.protect(item);
  });
};

runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 20, runCount: 1, title });
