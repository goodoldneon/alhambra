const { protect, release } = require('../src');

let obj;
let p;

beforeEach(() => {
  obj = {
    id: 1,
    metadata: {
      name: 'foo',
    },
    foo: {
      bar: {
        baz: 'aaa',
        arr: [1, 2, 3],
        objects: [{ a: 1 }, { a: 2 }, { a: 3 }],
      },
    },
    arr: [1, 2, 3],
  };

  p = protect(obj);
});

describe('is not created when', () => {
  it('nothing is changed', () => {
    const released = release(p);
    expect(obj === released).toBe(true);
  });
});

describe('is created when', () => {
  describe('primitive', () => {
    it('property is changed', () => {
      p.id = 2;

      const released = release(p);

      expect(obj === released).toBe(false);
    });

    it('nested property is changed', () => {
      p.metadata.name = 'bar';

      const released = release(p);

      expect(obj === released).toBe(false);
    });

    it('deeply nested property is changed', () => {
      p.foo.bar.baz = 'bbb';

      const released = release(p);

      expect(obj === released).toBe(false);
    });

    it('deeply nested delete operator is used', () => {
      delete p.foo.bar.baz;

      const released = release(p);

      expect(obj === released).toBe(false);
    });
  });

  describe('array', () => {
    it('index is changed', () => {
      p.arr[1] = 100;

      const released = release(p);

      expect(obj === released).toBe(false);
    });

    it('deeply nested index is changed', () => {
      p.foo.bar.arr[1] = 100;

      const released = release(p);

      expect(obj === released).toBe(false);
    });

    it('deeply nested push()', () => {
      p.foo.bar.arr.push();

      const released = release(p);

      expect(obj === released).toBe(false);
    });
  });

  describe('clone has same methods', () => {
    it('As Object.prototype', () => {
      const obj = { a: 1 };
      const p = protect(obj);
      const released = release(p);

      expect(p.hasOwnProperty('a')).toEqual(true);
      expect(released.hasOwnProperty('a')).toEqual(true);
    });

    it('in the instantiation prototype', () => {
      class Foo {
        func() {
          return 1;
        }
      }

      const foo = new Foo();
      const p = protect(foo);
      const released = release(p);

      expect(foo.__proto__.func()).toEqual(p.__proto__.func());
      expect(foo.__proto__.func()).toEqual(released.__proto__.func());
    });

    it('in the instantiation deep prototype', () => {
      class Foo {
        func() {
          return 1;
        }
      }

      class Bar extends Foo {}
      const bar = new Bar();
      const p = protect(bar);
      const released = release(p);

      expect(bar.__proto__.__proto__.func()).toEqual(p.__proto__.__proto__.func());
      expect(bar.__proto__.__proto__.func()).toEqual(released.__proto__.__proto__.func());
    });
  });
});

describe('mutate', () => {
  describe('does not change original when', () => {
    describe('primitive', () => {
      it('property is changed', () => {
        p.id = 2;
        expect(obj.id).toBe(1);
      });

      it('nested property is changed', () => {
        p.metadata.name = 'bar';
        expect(obj.metadata.name).toBe('foo');
      });

      it('deeply nested property is changed', () => {
        p.foo.bar.baz = 'bbb';
        expect(obj.foo.bar.baz).toBe('aaa');
      });

      it('multiple depths are changed', () => {
        p.foo.bar.baz = 'bbb';
        expect(obj.foo.bar.baz).toBe('aaa');
        p.metadata.name = 'bar';
        expect(obj.metadata.name).toBe('foo');
        p.id = 2;
        expect(obj.id).toBe(1);
      });

      it('multiple depths are changed', () => {
        p.id = 2;
        expect(obj.id).toBe(1);
        p.metadata.name = 'bar';
        expect(obj.metadata.name).toBe('foo');
        p.foo.bar.baz = 'bbb';
        expect(obj.foo.bar.baz).toBe('aaa');
      });

      it('deeply nested delete operator is used', () => {
        delete p.foo.bar.baz;
        expect(obj.foo.bar.baz).toBe('aaa');
      });
    });

    describe('array', () => {
      it('index is changed', () => {
        p.arr[1] = 100;
        expect(obj.arr[1]).toBe(2);
      });

      it('deeply nested index is changed', () => {
        p.foo.bar.arr[1] = 100;
        expect(obj.foo.bar.arr[1]).toBe(2);
      });

      it('deeply nested push()', () => {
        p.foo.bar.arr.push();
        expect(obj.foo.bar.arr.length).toBe(3);
      });
    });
  });

  describe('changes new object when', () => {
    describe('primitive', () => {
      it('property is changed', () => {
        p.id = 2;

        const released = release(p);

        expect(p.id).toBe(2);
        expect(released.id).toBe(2);
      });

      it('nested property is changed', () => {
        p.metadata.name = 'bar';

        const released = release(p);

        expect(p.metadata.name).toBe('bar');
        expect(released.metadata.name).toBe('bar');
      });

      it('deeply nested property is changed', () => {
        p.foo.bar.baz = 'bbb';

        const released = release(p);

        expect(p.foo.bar.baz).toBe('bbb');
        expect(released.foo.bar.baz).toBe('bbb');
      });

      it('multiple depths are changed', () => {
        p.foo.bar.baz = 'bbb';

        let released = release(p);

        expect(p.foo.bar.baz).toBe('bbb');
        expect(released.foo.bar.baz).toBe('bbb');
        p.metadata.name = 'bar';
        released = release(p);
        expect(p.metadata.name).toBe('bar');
        expect(released.metadata.name).toBe('bar');
        p.id = 2;
        released = release(p);
        expect(p.id).toBe(2);
        expect(released.id).toBe(2);
      });

      it('delete operator is used', () => {
        delete p.foo.bar.baz;

        const released = release(p);

        expect(p.foo.bar.baz).toBe(undefined);
        expect(released.foo.bar.baz).toBe(undefined);
      });
    });

    describe('array', () => {
      it('index is changed', () => {
        p.arr[1] = 100;

        const released = release(p);

        expect(p.arr[1]).toBe(100);
        expect(released.arr[1]).toBe(100);
      });

      it('deeply nested index is changed', () => {
        p.foo.bar.arr[1] = 100;

        const released = release(p);

        expect(p.foo.bar.arr[1]).toBe(100);
        expect(released.foo.bar.arr[1]).toBe(100);
      });

      it('push()', () => {
        p.arr.push(100);

        const released = release(p);

        expect(p.arr.length).toBe(4);
        expect(released.arr.length).toBe(4);
      });

      it('deeply nested push()', () => {
        p.foo.bar.arr.push(100);

        const released = release(p);

        expect(p.foo.bar.arr.length).toBe(4);
        expect(released.foo.bar.arr.length).toBe(4);
      });

      it("deeply nested change doesn't change other item references", () => {
        p.foo.bar.objects[1].a = 100;

        const released = release(p);

        expect(released.foo.bar.objects[0] === obj.foo.bar.objects[0]).toBe(true);
        expect(released.foo.bar.objects[1] === obj.foo.bar.objects[1]).toBe(false);
        expect(released.foo.bar.objects[2] === obj.foo.bar.objects[2]).toBe(true);
      });
    });
  });
});
