import { KEYS } from './index';
export function isContains(arr, matchArr) {
    if (!(arr instanceof Array) ||
        !(matchArr instanceof Array) ||
        arr.length === 0 ||
        matchArr.length === 0 ||
        arr.length < matchArr.length) {
        return false;
    }
    for (var _i = 0, matchArr_1 = matchArr; _i < matchArr_1.length; _i++) {
        var item = matchArr_1[_i];
        if (arr.indexOf(item) === -1) {
            return false;
        }
    }
    return true;
}
export function getMethods(Store, typeName) {
    var methods = {};
    var descriptor;
    var proto = Store.prototype;
    var protertyNames = Object.getOwnPropertyNames(proto);
    var mactcherProtos = [KEYS.actions, KEYS.mutations, KEYS.getters];
    if (!isContains(protertyNames, mactcherProtos) && !isContains(mactcherProtos, protertyNames)) {
        proto = proto.__proto__;
    }
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === typeName) {
            var names = proto[key];
            if (typeof names === 'function') {
                descriptor = Object.getOwnPropertyDescriptor(proto, key);
                methods = descriptor.value;
            }
            else {
                names.forEach(function (name) {
                    descriptor =
                        Object.getOwnPropertyDescriptor(Store.prototype, name) ||
                            Object.getOwnPropertyDescriptor(proto, name);
                    methods[name] = descriptor.value;
                });
            }
        }
    });
    return methods;
}
export function createMapping(context, key, funcName) {
    if (!context[key]) {
        context[key] = [];
    }
    context[key].push(funcName);
    return context;
}
var bailRE = /[^\w.$]/;
export function ObjectDeepUpdater(path) {
    if (bailRE.test(path)) {
        return;
    }
    var segments = path.split('.');
    return {
        get: function (obj) {
            segments.forEach(function (key) {
                if (!obj) {
                    return;
                }
                obj = obj[key];
            });
            return obj;
        },
        set: function (obj, value) {
            var property;
            var setter = null;
            segments.forEach(function (key) {
                if (!obj) {
                    return;
                }
                property = Object.getOwnPropertyDescriptor(obj, key);
                setter = property && property.set ? property.set : null;
                console.log(property, obj, key, setter);
                obj = obj[key];
            });
            if (process.env.NODE_ENV !== 'production' && !setter) {
                console.error("[Store-decorator warn]: property.set: (" + path + ") not found");
            }
            if (setter !== null) {
                setter.call(obj, value);
            }
        }
    };
}
