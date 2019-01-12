const alhambra = require('../src');

const arr = [{ a: 1 }, { a: 2 }, { a: 3 }];

const p = alhambra.protect(arr);

p.push(1);

const newP = p.map((item) => item);

newP[1].a = 100;

console.log(arr);
console.log(p);
console.log(alhambra.release(p));
