export function getMethods(Store, typeName) {
    var methods = {};
    var descriptor;
    var proto = Store.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === typeName) {
            var names = proto[key];
            if (typeof names === 'function') {
                descriptor = Object.getOwnPropertyDescriptor(proto, key);
                methods = descriptor.value;
            }
            else {
                names.forEach(function (name) {
                    descriptor = Object.getOwnPropertyDescriptor(proto, name);
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
                obj = obj[key];
            });
            if (process.env.NODE_ENV !== 'production' && !setter) {
                console.error("[Store-decorator warn]: property.set: (" + path + ") not found");
            }
            if (setter !== null) {
                setter.call(obj, value);
            }
        },
    };
}
