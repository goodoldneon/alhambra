const { ProxyFactory } = require('../src/ProxyFactory');

describe('New object', () => {
  const obj = {
    id: 1,
    metadata: {
      name: 'foo',
    },
  };

  it('is not created when nothing is changed', () => {
    const p = ProxyFactory(obj);
    const newObj = p.__target;

    expect(obj === newObj).toBe(true);
  });

  describe('is created when', () => {
    it('property is changed', () => {
      const p = ProxyFactory(obj);

      p.id = 2;

      const newObj = p.__target;

      expect(obj === newObj).toBe(false);
    });

    it('nested property is changed', () => {
      const p = ProxyFactory(obj);

      p.metadata.name = 'bar';

      const newObj = p.__target;

      expect(obj === newObj).toBe(false);
    });
  });
});

describe('Data change', () => {
  const obj = {
    id: 1,
    metadata: {
      name: 'foo',
    },
  };

  describe('does not change original', () => {
    it('when property is changed', () => {
      const p = ProxyFactory(obj);

      p.id = 2;

      expect(obj.id).toBe(1);
    });

    it('when nested property is changed', () => {
      const p = ProxyFactory(obj);

      p.metadata.name = 'bar';

      expect(obj.metadata.name).toBe('foo');
    });
  });

  describe('changes new object', () => {
    it('when property is changed', () => {
      const p = ProxyFactory(obj);

      p.id = 2;

      const newObj = p.__target;

      expect(newObj.id).toBe(2);
    });

    it('when nested property is changed', () => {
      const p = ProxyFactory(obj);

      p.metadata.name = 'bar';

      const newObj = p.__target;

      expect(newObj.metadata.name).toBe('bar');
    });
  });
});
