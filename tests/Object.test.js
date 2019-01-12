const { ProxyFactory } = require('../src/ProxyFactory');

describe('Object', () => {
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
        },
      },
    };

    p = ProxyFactory(obj);
  });

  describe('is not created when', () => {
    it('nothing is changed', () => {
      expect(obj === p.__copy).toBe(true);
    });
  });

  describe('is created when', () => {
    it('property is changed', () => {
      p.id = 2;
      expect(obj === p.__copy).toBe(false);
    });

    it('nested property is changed', () => {
      p.metadata.name = 'bar';
      expect(obj === p.__copy).toBe(false);
    });

    it('deeply nested property is changed', () => {
      p.foo.bar.baz = 'bbb';
      expect(obj === p.__copy).toBe(false);
    });

    it('delete operator is used', () => {
      delete p.foo.bar.baz;
      expect(obj === p.__copy).toBe(false);
    });
  });

  describe('mutate', () => {
    describe('does not change original when', () => {
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

    describe('changes new object when', () => {
      it('property is changed', () => {
        p.id = 2;
        expect(p.id).toBe(2);
        expect(p.__copy.id).toBe(2);
      });

      it('nested property is changed', () => {
        p.metadata.name = 'bar';
        expect(p.metadata.name).toBe('bar');
        expect(p.__copy.metadata.name).toBe('bar');
      });

      it('deeply nested property is changed', () => {
        p.foo.bar.baz = 'bbb';
        expect(p.foo.bar.baz).toBe('bbb');
        expect(p.__copy.foo.bar.baz).toBe('bbb');
      });

      it('multiple depths are changed', () => {
        p.foo.bar.baz = 'bbb';
        expect(p.foo.bar.baz).toBe('bbb');
        expect(p.__copy.foo.bar.baz).toBe('bbb');
        p.metadata.name = 'bar';
        expect(p.metadata.name).toBe('bar');
        expect(p.__copy.metadata.name).toBe('bar');
        p.id = 2;
        expect(p.id).toBe(2);
        expect(p.__copy.id).toBe(2);
      });

      it('delete operator is used', () => {
        delete p.foo.bar.baz;
        expect(p.foo.bar.baz).toBe(undefined);
        expect(p.__copy.foo.bar.baz).toBe(undefined);
      });
    });
  });
});
