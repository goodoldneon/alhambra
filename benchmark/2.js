const alhambra = require('../src');
const { runBenchmark } = require('./index');

const arrLength = 10e4;
const arr = Array(arrLength).fill({});
// const p = alhambra.protect(arr);
let title;
let job;

title = `Iterate ${arrLength} length array`;

job = () => {
  arr.forEach((item) => {
    const foo = item;
  });
};

runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 50, title });

title = `Iterate ${arrLength} length array, which resulted from alhambra.protect()`;

job = () => {
  const p = alhambra.protect(arr);

  p.forEach((item) => {
    const foo = item;
  });
};

runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 50, title });

title = `Iterate ${arrLength} length array, which resulted from alhambra.protect()`;

const p = alhambra.protect(arr);

job = () => {

  p.forEach((item) => {
    const foo = item;
  });
};

runBenchmark(job, { ignoreFirstJob: true, jobCountPerRun: 50, title });
