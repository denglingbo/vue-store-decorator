import store from '../demo/store';
import { isContains } from '../util';
expect.extend({
    isContains: function (arr1, arr2) {
        var pass = isContains(arr1, arr2);
        return {
            message: function () { return pass ? "expected " + arr1 + " to be divisible by " + arr2 : "expected " + arr1 + " to be divisible by " + arr2; },
            pass: pass,
        };
    },
});
describe("store test", function () {
    it('Check store decorator prototype', function () {
        var all = ['namespaced', 'state', 'mutations', 'actions', 'getters'];
        var compare = Object.keys(store);
        expect(all).isContains(compare);
    });
});
