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

    // it('deeply nested property is changed', () => {
    //   p.foo.bar.baz = 'bbb';

    //   const newObj = p.__copy;

    //   expect(obj === newObj).toBe(false);
    // });
  });

  // describe('mutate', () => {
  //   describe('does not change original', () => {
  //     it('when property is changed', () => {
  //       p.id = 2;
  //       expect(obj.id).toBe(1);
  //     });

  //     it('when nested property is changed', () => {
  //       p.metadata.name = 'bar';
  //       expect(obj.metadata.name).toBe('foo');
  //     });

  //     it('when deeply nested property is changed', () => {
  //       p.foo.bar.baz = 'bbb';
  //       expect(obj.foo.bar.baz).toBe('aaa');
  //     });

  //     it('when multiple depths are changed', () => {
  //       p.foo.bar.baz = 'bbb';
  //       expect(obj.foo.bar.baz).toBe('aaa');
  //       p.metadata.name = 'bar';
  //       expect(obj.metadata.name).toBe('foo');
  //       p.id = 2;
  //       expect(obj.id).toBe(1);
  //     });
  //   });

  //   describe('changes new object', () => {
  //     it('when property is changed', () => {
  //       p.id = 2;
  //       expect(p.id).toBe(2);
  //       expect(p.__copy.id).toBe(2);
  //     });

  //     it('when nested property is changed', () => {
  //       p.metadata.name = 'bar';
  //       expect(p.metadata.name).toBe('bar');
  //       expect(p.__copy.metadata.name).toBe('bar');
  //     });

  //     it('when deeply nested property is changed', () => {
  //       p.foo.bar.baz = 'bbb';
  //       expect(p.foo.bar.baz).toBe('bbb');
  //       expect(p.__copy.foo.bar.baz).toBe('bbb');
  //     });

  //     it('when multiple depths are changed', () => {
  //       p.foo.bar.baz = 'bbb';
  //       expect(p.foo.bar.baz).toBe('bbb');
  //       expect(p.__copy.foo.bar.baz).toBe('bbb');
  //       p.metadata.name = 'bar';
  //       expect(p.metadata.name).toBe('bar');
  //       expect(p.__copy.metadata.name).toBe('bar');
  //       p.id = 2;
  //       expect(p.id).toBe(2);
  //       expect(p.__copy.id).toBe(2);
  //     });
  //   });
  // });
});

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

      it('when multiple depths are changed', () => {
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

    describe('changes new object', () => {
      it('when property is changed', () => {
        p.id = 2;
        expect(p.id).toBe(2);
        expect(p.__copy.id).toBe(2);
      });

      it('when nested property is changed', () => {
        p.metadata.name = 'bar';
        expect(p.metadata.name).toBe('bar');
        expect(p.__copy.metadata.name).toBe('bar');
      });

      it('when deeply nested property is changed', () => {
        p.foo.bar.baz = 'bbb';
        expect(p.foo.bar.baz).toBe('bbb');
        expect(p.__copy.foo.bar.baz).toBe('bbb');
      });

      it('when multiple depths are changed', () => {
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
