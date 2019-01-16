import { createMapping, ObjectDeepUpdater } from '../util';
function observe(obj, key) {
    var property = Object.getOwnPropertyDescriptor(obj, key);
    var getter = property && property.get;
    var setter = property && property.set;
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            if (property) {
                return 'h2';
            }
        },
        set: function reactiveSetter(newVal) {
            if (setter) {
                setter.call(obj, newVal);
            }
        }
    });
    return obj;
}
describe("store util test", function () {
    it('Check createMapping', function () {
        var source = createMapping({}, '__actions__', 'myFuncTest');
        expect(source).toEqual({ __actions__: ['myFuncTest'] });
    });
    it('Check ObjectDeepUpdater', function () {
        var source = observe({ a: 1, b: { b1: 'b1' } }, 'a');
        var updater = ObjectDeepUpdater('a');
        if (updater) {
            updater.set(source, 'h2');
        }
        expect(source).toEqual({ a: 'h2', b: { b1: 'b1' } });
    });
});
