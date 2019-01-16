const getSecondsPerJob = (elapsed, runCount) => {
  const ms = elapsed / runCount;

  return `${Math.round(ms)} ms`;
};

const displayResults = ({ elapsed, runCount, title }) => {
  const text = `
----------------
${title}

Time per job:  ${getSecondsPerJob(elapsed, runCount)}
Jobs per Run:  ${runCount}
################
  `;

  console.log(text);
};

const runBenchmark = (job, { ignoreFirstJobInRun = false, runCount = 1, title }) => {
  let startTime = new Date();
  let elapsed = 0;

  for (let runJobIndex = 0; runJobIndex < runCount; runJobIndex++) {
    job();

    if (ignoreFirstJobInRun && runJobIndex === 0) {
      startTime = new Date();
    }

    elapsed = new Date() - startTime;
  }

  displayResults({ elapsed, runCount, title });
};

module.exports = { runBenchmark };
