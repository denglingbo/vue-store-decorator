var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { createMapping } from './util';
import { KEYS } from './index';
export default function AutoLoading(target) {
    var proto = target.prototype;
    createMapping(proto, KEYS.mutations, KEYS.loadingMutation);
    createMapping(proto, KEYS.getters, 'loadings');
    proto[KEYS.loadingMutation] = function (state, payload) {
        var loadings = state.loadings;
        var name = payload.name, value = payload.value;
        if (loadings && loadings[name] !== undefined) {
            loadings[name] = value;
        }
    };
    proto.loadings = function (state) { return (__assign({}, state.loadings)); };
    return target;
}
