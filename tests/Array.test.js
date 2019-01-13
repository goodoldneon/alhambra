const { protect, release } = require('../src');

describe('Array', () => {
  let arr;
  let p;

  beforeEach(() => {
    arr = [3, 2, 1];

    p = protect(arr);
  });

  it('is not created when nothing is changed', () => {
    const released = release(p);

    expect(arr === released).toBe(true);
  });

  describe('is created when', () => {
    it('index is changed', () => {
      p[2] = 100;

      const released = release(p);

      expect(arr === released).toBe(false);
    });

    it('push', () => {
      p.push(100);

      const released = release(p);

      expect(arr === released).toBe(false);
    });

    it('sort', () => {
      p.sort();

      const released = release(p);

      expect(arr === released).toBe(false);
    });

    it('delete operator is used', () => {
      delete p[1];

      const released = release(p);

      expect(arr === released).toBe(false);
    });
  });

  describe('mutate', () => {
    describe('does not change original when', () => {
      it('index is changed', () => {
        p[1] = 100;
        expect(arr[1]).toBe(2);
      });

      it('push', () => {
        p.push(100);
        expect(arr.length).toBe(3);
      });

      it('sort', () => {
        p.sort();
        expect(arr[0]).toBe(3);
      });
    });

    describe('changes new object', () => {
      it('index is changed', () => {
        p[1] = 100;

        const released = release(p);

        expect(p[1]).toBe(100);
        expect(released[1]).toBe(100);
      });

      it('push', () => {
        p.push(100);

        const released = release(p);

        expect(p.length).toBe(4);
        expect(released.length).toBe(4);
      });

      it('sort', () => {
        p.sort();

        const released = release(p);

        expect(p[0]).toBe(1);
        expect(released[0]).toBe(1);
      });

      it('delete operator is used', () => {
        delete p[1];

        const released = release(p);

        expect(p[1]).toBe(undefined);
        expect(released[1]).toBe(undefined);
      });
    });
  });
});

describe('Array of objects', () => {
  let arr;
  let p;

  beforeEach(() => {
    arr = [{ a: 1 }, { a: 2 }, { a: 3 }];

    p = protect(arr);
  });

  describe('mutate', () => {
    describe('does not change original when', () => {
      it('index is changed', () => {
        p[1].a = 100;
        expect(arr[1].a).toBe(2);
      });

      it('forEach() mutate', () => {
        p.forEach((item) => (item.a = 100));
        expect(arr[1].a).toBe(2);
      });

      it('delete operator is used', () => {
        delete p[1].a;
        expect(arr[1].a).toBe(2);
      });
    });

    describe('changes new object', () => {
      it('index is changed', () => {
        p[1].a = 100;

        const released = release(p);

        expect(p[1].a).toBe(100);
        expect(released[1].a).toBe(100);
      });

      it('forEach() mutate', () => {
        p.forEach((item) => (item.a = 100));

        const released = release(p);

        expect(p[1].a).toBe(100);
        expect(released[1].a).toBe(100);
      });

      it('delete operator is used', () => {
        delete p[1].a;

        const released = release(p);

        expect(p[1].a).toBe(undefined);
        expect(released[1].a).toBe(undefined);
      });
    });

    it("doesn't change other item references", () => {
      p[1].a = 100;

      const released = release(p);

      expect(released[0] === arr[0]).toBe(true);
      expect(released[1] === arr[1]).toBe(false);
      expect(released[2] === arr[2]).toBe(true);
    });
  });

  describe('clone has same methods', () => {
    it('As Object.prototype', () => {
      expect(p[1].hasOwnProperty('a')).toEqual(true);
    });

    it('in the instantiation prototype', () => {
      class Foo {
        func() {
          return 1;
        }
      }

      const arr = [new Foo()];
      const p = protect(arr);
      const released = release(p);

      expect(arr[0].func()).toEqual(p[0].func());
      expect(arr[0].func()).toEqual(released[0].func());
      expect(arr[0].__proto__.func()).toEqual(p[0].__proto__.func());
      expect(arr[0].__proto__.func()).toEqual(released[0].__proto__.func());
    });

    it('in the instantiation deep prototype', () => {
      class Foo {
        func() {
          return 1;
        }
      }

      class Bar extends Foo {}
      const arr = [new Bar()];
      const p = protect(arr);
      const released = release(p);

      expect(arr[0].func()).toEqual(p[0].func());
      expect(arr[0].func()).toEqual(released[0].func());
      expect(arr[0].__proto__.__proto__.func()).toEqual(p[0].__proto__.__proto__.func());
      expect(arr[0].__proto__.__proto__.func()).toEqual(released[0].__proto__.__proto__.func());
    });
  });
});
