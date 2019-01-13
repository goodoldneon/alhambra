const alhambra = require('../src');

class Foo {
  func() {
    return 1;
  }
}

class Bar extends Foo {}
const arr = [new Bar()];
const p = alhambra.protect(arr);

console.log(arr[0].__proto__.__proto__.func());
console.log(p[0].__proto__.__proto__.func());
