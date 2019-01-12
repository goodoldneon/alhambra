const alhambra = require('../src');

class Foo {
  constructor() {
    this.id = 1;
  }

  greet() {
    console.log('Hello!');
  }
}

const obj = new Foo();
const p = alhambra.protect(obj);

p.id = 2;
p.greet(); // Still works.

const newObj = alhambra.release(p);

console.log(obj.id === 1); // True
console.log(newObj.id === 2); // True
