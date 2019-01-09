var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { createMapping } from './util';
import { KEYS } from './index';
export default function AutoErrors(target) {
    var proto = target.prototype;
    var descriptor = Object.getOwnPropertyDescriptor(proto, 'state');
    proto.state = function () { return (__assign({ errors: {} }, descriptor.value())); };
    createMapping(proto, KEYS.mutations, KEYS.errorsMutation);
    createMapping(proto, KEYS.getters, 'errors');
    proto[KEYS.errorsMutation] = function (state, payload) {
        var errors = state.errors;
        var name = payload.name, value = payload.value;
        if (errors && errors[name] !== undefined) {
            errors[name] = value;
        }
    };
    proto.errors = function (state) { return (__assign({}, state.errors)); };
    return target;
}
