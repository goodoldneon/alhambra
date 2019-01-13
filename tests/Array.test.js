const { ProxyFactory } = require('../src/ProxyFactory');

describe('Array', () => {
  let arr;
  let p;

  beforeEach(() => {
    arr = [3, 2, 1];

    p = ProxyFactory(arr);
  });

  it('is not created when nothing is changed', () => {
    expect(arr === p.__copy).toBe(true);
  });

  describe('is created when', () => {
    it('index is changed', () => {
      p[2] = 100;
      expect(arr === p.__copy).toBe(false);
    });

    it('push', () => {
      p.push(100);
      expect(arr === p.__copy).toBe(false);
    });

    it('sort', () => {
      p.sort();
      expect(arr === p.__copy).toBe(false);
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
        expect(p[1]).toBe(100);
        expect(p.__copy[1]).toBe(100);
      });

      it('push', () => {
        p.push(100);
        expect(p.length).toBe(4);
        expect(p.__copy.length).toBe(4);
      });

      it('sort', () => {
        p.sort();
        expect(p[0]).toBe(1);
        expect(p.__copy[0]).toBe(1);
      });
    });
  });
});

describe('Array of objects', () => {
  let arr;
  let p;

  beforeEach(() => {
    arr = [{ a: 1 }, { a: 2 }, { a: 3 }];

    p = ProxyFactory(arr);
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
    });

    describe('changes new object', () => {
      it('index is changed', () => {
        p[1].a = 100;
        expect(p[1].a).toBe(100);
        expect(p.__copy[1].a).toBe(100);
      });

      it('forEach() mutate', () => {
        p.forEach((item) => (item.a = 100));
        expect(p[1].a).toBe(100);
        expect(p.__copy[1].a).toBe(100);
      });
    });
  });
});
