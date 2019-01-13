const alhambra = require('../src');
const arr = [{ a: 1 }, { a: 2 }, { a: 3 }];
const p = alhambra.protect(arr);

p[1].a = 100;
// console.log(p[0] === p.__copy[0])
console.log(arr[0] === p.__internal[0]);
p[0]
console.log(arr[0] === p.__internal[0]);

// const reverse = alhambra.release(p);
// const replaced = alhambra.replaceChanged(p, reverse);

// console.log(arr[0] === replaced[0]);

const { clone } = require('lodash');

const newArr = clone(arr);


// console.log(arr[0] === newArr[0])