const alhambra = require('../src');

const arr = [{ a: 1 }, { a: 2 }, { a: 3 }];

const p = alhambra.protect(arr);

p[1].a = 100;

console.log(arr, p, p.__copy);
