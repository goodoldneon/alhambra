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

  it('is not created when nothing is changed', () => {
    const newObj = p.__copy;

    expect(obj === newObj).toBe(true);
  });

  describe('is created when', () => {
    it('property is changed', () => {
      p.id = 2;

      const newObj = p.__copy;

      expect(obj === newObj).toBe(false);
    });

    it('nested property is changed', () => {
      p.metadata.name = 'bar';

      const newObj = p.__copy;

      expect(obj === newObj).toBe(false);
    });

    it('deeply nested property is changed', () => {
      p.foo.bar.baz = 'bbb';

      const newObj = p.__copy;

      expect(obj === newObj).toBe(false);
    });
  });

  describe('Data change', () => {
    describe('does not change original', () => {
      it('when property is changed', () => {
        p.id = 2;

        expect(obj.id).toBe(1);
      });

      it('when nested property is changed', () => {
        p.metadata.name = 'bar';

        expect(obj.metadata.name).toBe('foo');
      });

      it('when deeply nested property is changed', () => {
        p.foo.bar.baz = 'bbb';

        expect(obj.foo.bar.baz).toBe('aaa');
      });
    });

    describe('changes new object', () => {
      it('when property is changed', () => {
        p.id = 2;

        const newObj = p.__copy;

        expect(newObj.id).toBe(2);
      });

      it('when nested property is changed', () => {
        p.metadata.name = 'bar';

        const newObj = p.__copy;

        expect(newObj.metadata.name).toBe('bar');
      });
    });
  });
});
