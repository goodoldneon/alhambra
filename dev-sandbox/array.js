const alhambra = require('../src');

const arr = [3, 2, 1];

const p = alhambra.protect(arr);

p[1] = 100;
p.sort();

console.log(arr, p, p.__copy);
