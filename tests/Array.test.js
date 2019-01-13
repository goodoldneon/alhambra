const { protect, release } = require('../src');

describe('Array', () => {
  let arr;
  let p;

  beforeEach(() => {
    arr = [3, 2, 1];

    p = protect(arr);
  });

  it('is not created when nothing is changed', () => {
    const reversed = release(p);

    expect(arr === reversed).toBe(true);
  });

  describe('is created when', () => {
    it('index is changed', () => {
      p[2] = 100;

      const reversed = release(p);

      expect(arr === reversed).toBe(false);
    });

    it('push', () => {
      p.push(100);

      const reversed = release(p);

      expect(arr === reversed).toBe(false);
    });

    it('sort', () => {
      p.sort();

      const reversed = release(p);

      expect(arr === reversed).toBe(false);
    });

    it('delete operator is used', () => {
      delete p[1];

      const reversed = release(p);

      expect(arr === reversed).toBe(false);
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

        const reversed = release(p);

        expect(p[1]).toBe(100);
        expect(reversed[1]).toBe(100);
      });

      it('push', () => {
        p.push(100);

        const reversed = release(p);

        expect(p.length).toBe(4);
        expect(reversed.length).toBe(4);
      });

      it('sort', () => {
        p.sort();

        const reversed = release(p);

        expect(p[0]).toBe(1);
        expect(reversed[0]).toBe(1);
      });

      it('delete operator is used', () => {
        delete p[1];

        const reversed = release(p);

        expect(p[1]).toBe(undefined);
        expect(reversed[1]).toBe(undefined);
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

        const reversed = release(p);

        expect(p[1].a).toBe(100);
        expect(reversed[1].a).toBe(100);
      });

      it('forEach() mutate', () => {
        p.forEach((item) => (item.a = 100));

        const reversed = release(p);

        expect(p[1].a).toBe(100);
        expect(reversed[1].a).toBe(100);
      });

      it('delete operator is used', () => {
        delete p[1].a;
  
        const reversed = release(p);

        expect(p[1].a).toBe(undefined);
        expect(reversed[1].a).toBe(undefined);
      });
    });

    it("doesn't change other item references", () => {
      p[1].a = 100;

      const reverse = release(p);

      expect(reverse[0] === arr[0]).toBe(true);
      expect(reverse[1] === arr[1]).toBe(false);
      expect(reverse[2] === arr[2]).toBe(true);
    });
  });
});
