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
    const reversed = release(p);
    expect(obj === reversed).toBe(true);
  });
});

describe('is created when', () => {
  describe('primitive', () => {
    it('property is changed', () => {
      p.id = 2;

      const reversed = release(p);

      expect(obj === reversed).toBe(false);
    });

    it('nested property is changed', () => {
      p.metadata.name = 'bar';

      const reversed = release(p);

      expect(obj === reversed).toBe(false);
    });

    it('deeply nested property is changed', () => {
      p.foo.bar.baz = 'bbb';

      const reversed = release(p);

      expect(obj === reversed).toBe(false);
    });

    it('delete operator is used', () => {
      delete p.foo.bar.baz;

      const reversed = release(p);

      expect(obj === reversed).toBe(false);
    });
  });

  describe('array', () => {
    it('index is changed', () => {
      p.arr[1] = 100;

      const reversed = release(p);

      expect(obj === reversed).toBe(false);
    });

    it('deeply nested index is changed', () => {
      p.foo.bar.arr[1] = 100;

      const reversed = release(p);

      expect(obj === reversed).toBe(false);
    });

    it('deeply nested push()', () => {
      p.foo.bar.arr.push();

      const reversed = release(p);

      expect(obj === reversed).toBe(false);
    });
  });

  describe('clone has same methods', () => {
    it('As Object.prototype', () => {
      const obj = { a: 1 };
      const p = protect(obj);

      expect(p.hasOwnProperty('a')).toEqual(true);
    });

    it('on the instantiation', () => {
      class Foo {
        func() {
          return 1;
        }
      }

      const foo = new Foo();
      const p = protect(foo);

      expect(foo.func()).toEqual(p.func());
    });

    it('in the instantiation prototype', () => {
      class Foo {
        func() {
          return 1;
        }
      }

      const foo = new Foo();
      const p = protect(foo);

      expect(foo.func()).toEqual(p.func());
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

      expect(bar.func()).toEqual(p.func());
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

      it('delete operator is used', () => {
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

        const reversed = release(p);

        expect(p.id).toBe(2);
        expect(reversed.id).toBe(2);
      });

      it('nested property is changed', () => {
        p.metadata.name = 'bar';

        const reversed = release(p);

        expect(p.metadata.name).toBe('bar');
        expect(reversed.metadata.name).toBe('bar');
      });

      it('deeply nested property is changed', () => {
        p.foo.bar.baz = 'bbb';

        const reversed = release(p);

        expect(p.foo.bar.baz).toBe('bbb');
        expect(reversed.foo.bar.baz).toBe('bbb');
      });

      it('multiple depths are changed', () => {
        p.foo.bar.baz = 'bbb';

        let reversed = release(p);

        expect(p.foo.bar.baz).toBe('bbb');
        expect(reversed.foo.bar.baz).toBe('bbb');
        p.metadata.name = 'bar';
        reversed = release(p);
        expect(p.metadata.name).toBe('bar');
        expect(reversed.metadata.name).toBe('bar');
        p.id = 2;
        reversed = release(p);
        expect(p.id).toBe(2);
        expect(reversed.id).toBe(2);
      });

      it('delete operator is used', () => {
        delete p.foo.bar.baz;

        const reversed = release(p);

        expect(p.foo.bar.baz).toBe(undefined);
        expect(reversed.foo.bar.baz).toBe(undefined);
      });
    });

    describe('array', () => {
      it('index is changed', () => {
        p.arr[1] = 100;
        delete p.foo.bar.baz;

        const reversed = release(p);

        expect(p.arr[1]).toBe(100);
        expect(reversed.arr[1]).toBe(100);
      });

      it('deeply nested index is changed', () => {
        p.foo.bar.arr[1] = 100;
        delete p.foo.bar.baz;

        const reversed = release(p);

        expect(p.foo.bar.arr[1]).toBe(100);
        expect(reversed.foo.bar.arr[1]).toBe(100);
      });

      it('push()', () => {
        p.arr.push(100);
        delete p.foo.bar.baz;

        const reversed = release(p);

        expect(p.arr.length).toBe(4);
        expect(reversed.arr.length).toBe(4);
      });

      it('deeply nested push()', () => {
        p.foo.bar.arr.push(100);
        delete p.foo.bar.baz;

        const reversed = release(p);

        expect(p.foo.bar.arr.length).toBe(4);
        expect(reversed.foo.bar.arr.length).toBe(4);
      });

      it("deeply nested change doesn't change other item references", () => {
        p.foo.bar.objects[1].a = 100;

        const reverse = release(p);

        expect(reverse.foo.bar.objects[0] === obj.foo.bar.objects[0]).toBe(true);
        expect(reverse.foo.bar.objects[1] === obj.foo.bar.objects[1]).toBe(false);
        expect(reverse.foo.bar.objects[2] === obj.foo.bar.objects[2]).toBe(true);
      });
    });
  });
});
