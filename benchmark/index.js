const getSecondsPerJob = (elapsed, jobCountPerRun, runCount) => {
  const ms = elapsed / jobCountPerRun / runCount;

  return `${Math.round(ms)} ms`;
};

const displayResults = ({ elapsed, jobCountPerRun, runCount, title }) => {
  const text = `
-~~<========>~~-
${title}

Time per job:  ${getSecondsPerJob(elapsed, jobCountPerRun, runCount)}
Runs:          ${jobCountPerRun}
Jobs per Run:  ${runCount}
----------------
  `;

  console.log(text);
};

const runBenchmark = (job, { ignoreFirstJob = false, jobCountPerRun = 1, runCount = 1, title }) => {
  let startTime = new Date();
  let elapsed = 0;

  for (let runIndex = 0; runIndex < runCount; runIndex++) {
    for (let runJobIndex = 0; runJobIndex < jobCountPerRun; runJobIndex++) {
      job();

      if (ignoreFirstJob && runJobIndex === 0) {
        startTime = new Date();
      }
    }

    elapsed += new Date() - startTime;
  }

  displayResults({ elapsed, jobCountPerRun, runCount, title });
};

module.exports = { runBenchmark };
