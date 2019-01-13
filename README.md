# alhambraJS

Protect data from mutation. Cheap clone instead.

# Usage

Directly mutating an object's properties keeps the original unchanged.

```js
const alhambra = require('alhambra');
const obj = { id: 1 };
const p = alhambra.protect(obj);

p.id = 2;

const newObj = alhambra.release(p);

console.log(obj.id === 1); // True
console.log(newObj.id === 2); // True
```

The original object is returned when the protected object isn't changed.

```js
const alhambra = require('alhambra');
const obj = { id: 1 };

const p = alhambra.protect(obj);
const newObj = alhambra.release(p);

console.log(obj === newObj); // True
```

In arrays of objects, unchanged objects keep the same reference.

```js
const alhambra = require('alhambra');

const obj = {
  foo: {
    bar: {
      items: [{ a: 1 }, { a: 2 }, { a: 3 }],
    },
  },
};

const p = alhambra.protect(obj);

p.foo.bar.items[1].a = 100;

const reversed = alhambra.release(p);

console.log(reversed.foo.bar.items[0] === obj.foo.bar.items[0]); // True
console.log(reversed.foo.bar.items[1] === obj.foo.bar.items[1]); // False
console.log(reversed.foo.bar.items[2] === obj.foo.bar.items[2]); // True
```

Arrays.

```js
const alhambra = require('alhambra');
const arr = [1, 2, 3];
const p = alhambra.protect(arr);

p.push(4);

const newArr = alhambra.release(p);

console.log(arr.length === 3); // True
console.log(newArr.length === 4); // True
```

Deeply-nested properties.

```js
const alhambra = require('alhambra');

const obj = {
  foo: {
    bar: {
      arr: [1, 2, 3],
    },
  },
};

const p = alhambra.protect(obj);

p.foo.bar.arr.push(4);

const newObj = alhambra.release(p);

console.log(obj.foo.bar.arr.length === 3); // True
console.log(newObj.foo.bar.arr.length === 4); // True
```

Instantiations.

```js
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
```

## Caveats

Mutations to the source can still affect the new object. This is because the `protect()` method is designed to protect the source, rather than new object.

```js
const alhambra = require('alhambra');
const obj = { id: 1 };
const p = alhambra.protect(obj);

obj.id = 2;

const newObj = alhambra.release(p);

console.log(obj.id === 2); // True
console.log(newObj.id === 2); // True
```
