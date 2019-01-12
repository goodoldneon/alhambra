const alhambra = require('../src');

const arr = [3, 2, 1];

const p = alhambra.protect(arr);

// p[2] = 100;

p.push('a', 'b')

console.log(arr, p, p.__copy);
