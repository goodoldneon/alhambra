const alhambra = require('../src');
const obj = { id: 1 };
const p = alhambra.protect(obj);

obj.id = 2;

const newObj = alhambra.release(p);

console.log(obj.id === 2); // True
console.log(newObj.id === 2); // True
