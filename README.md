# Alhambra

Protect objects/arrays from mutation without deep cloning.

Alhambra uses [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and [shallow clones](https://lodash.com/docs/4.17.11#clone) to protect the "original" object from mutation. The "protected" object has the same behavior as the original object: getters, setters, methods, and the prototype chain act the same.

If you want to remove the Proxy wrappers from the protected object, use `alhambra.release()` on it.

# Comparison to deep cloning

## Alhambra

- Pros:
  - Creation cost does not increase as size increases.
- Cons:
  - Interaction cost of the clone is more expensive than the original.
  - Interaction cost increases as the nesting depth of properties increase. For example, getting `clone.foo` is more expensive than getting `clone.foo.bar`.

## Deep clone

- Pros:
  - Interaction (get, set, etc.) cost of the clone is the same as the original.
  - Interaction cost does not increase as size increases.
- Cons:
  - Creation cost increases as size of original increases.

## In other words

- Alhambra is better when you "clone big/frequently and interact small/infrequently".
  - For example, if you clone an array of 10 million objects and only interact with a few objects.
- Deep cloning is better when you "clone small/infrequently and interact big/frequently".
  - For example, if you clone an array of 10 million objects and iterate over the entire array.

# Usage

`npm install alhambra`

## Objects

Directly mutating an object's properties keeps the original unchanged.

```js
const obj = { id: 1 };
const p = alhambra.protect(obj);

p.id = 2;

const newObj = alhambra.release(p);

console.log(obj.id === 1); // True
console.log(newObj.id === 2); // True
```

Nested properties are protected, too.

```js
const obj = { foo: { bar: 1 } };
const p = alhambra.protect(obj);

p.foo.bar = 2;

const newObj = alhambra.release(p);

console.log(obj.foo.bar === 1); // True
console.log(newObj.foo.bar === 2); // True
```

The original object is returned when the protected object isn't changed.

```js
const obj = { id: 1 };
const p = alhambra.protect(obj);
const newObj = alhambra.release(p);

console.log(obj === newObj); // True
```

Instantiation.

```js
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

## Arrays

Prototype methods work.

```js
const alhambra = require('alhambra');
const arr = [1, 2, 3];
const p = alhambra.protect(arr);

p.push(4);

const newArr = alhambra.release(p);

console.log(arr.length === 3); // True
console.log(newArr.length === 4); // True
```

Nested array.

```js
const alhambra = require('alhambra');
const obj = {
  foo: {
    arr: [1, 2, 3],
  },
};
const p = alhambra.protect(obj);

p.foo.bar.arr.push(4);

const newObj = alhambra.release(p);

console.log(obj.foo.arr.length === 3); // True
console.log(newObj.foo.arr.length === 4); // True
```

## Arrays of objects

Unchanged objects keep the same reference.

```js
const alhambra = require('alhambra');
const obj = {
  foo: {
    arr: [{ a: 1 }, { a: 2 }, { a: 3 }],
  },
};
const p = alhambra.protect(obj);

p.foo.arr[1].a = 100;

const reversed = alhambra.release(p);

console.log(reversed.foo.arr[0] === obj.foo.arr[0]); // True
console.log(reversed.foo.arr[1] === obj.foo.arr[1]); // False
console.log(reversed.foo.arr[2] === obj.foo.arr[2]); // True
```

# Caveats

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
