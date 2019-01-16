import { getMethods, createMapping, ObjectDeepUpdater } from '../util';

// Mock
function observe(obj: any, key: string) {
  const property = Object.getOwnPropertyDescriptor(obj, key);
  const getter = property && property.get;
  const setter = property && property.set;

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      if (property) {
        return 'h2';
      }
    },
    set: function reactiveSetter (newVal) {
      if (setter) {
        setter.call(obj, newVal);
      }
    }
  });

  return obj;
}

describe("store util test", () => {
  it('Check createMapping', () => {
    const source = createMapping({}, '__actions__', 'myFuncTest');

    expect(source).toEqual({ __actions__: [ 'myFuncTest' ] });
  });

  it('Check ObjectDeepUpdater', () => {
    const source = observe({ a: 1, b: { b1: 'b1' } }, 'a');
    const updater = ObjectDeepUpdater('a');

    if (updater) {
      updater.set(source, 'h2');
    }

    expect(source).toEqual({ a: 'h2', b: { b1: 'b1' } });
  });
});
