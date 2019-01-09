'use strict';
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
import AutoLoading from './AutoLoading';
import AutoErrors from './AutoErrors';
import { createMapping, getMethods, ObjectDeepUpdater } from './util';
var KEYS = {
    state: 'state',
    actions: '__actions__',
    mutations: '__mutations__',
    getters: '__getters__',
    loadingMutation: 'onLoadingStateChange',
    errorsMutation: 'onErrorStateChange',
};
export { AutoLoading, AutoErrors, KEYS };
export function Getter(target, name, descriptor) {
    createMapping(target, KEYS.getters, name);
    return descriptor;
}
export function Mutation(stateName) {
    return function (target, name, descriptor) {
        var method = descriptor.value;
        var ret;
        createMapping(target, KEYS.mutations, name);
        descriptor.value = function (state) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            ret = method.apply(target, [state].concat(args));
            if (stateName) {
                var updater = ObjectDeepUpdater(stateName);
                if (updater) {
                    var oldValue = updater.get(state);
                    var oldType = Object.prototype.toString.call(oldValue);
                    var newType = Object.prototype.toString.call(ret);
                    if (process.env.NODE_ENV !== 'production' && newType !== oldType) {
                        console.error("[Store-decorator warn]: old type: (" + oldType + ") -> new type: (" + newType + "). "
                            + ("mutation: (" + name + "), path: (" + stateName + ")."));
                    }
                    updater.set(state, ret);
                }
            }
            return ret;
        };
        return descriptor;
    };
}
var defaultActionOptions = {
    autoLoading: true,
    autoErrors: true,
    autoPayload: true,
};
var autoCreator = function (target, name, type, defValue) {
    var stateDescriptor = Object.getOwnPropertyDescriptor(target, KEYS.state);
    var state = stateDescriptor.value();
    stateDescriptor.value = function () {
        var _a;
        var autos = state[type] || {};
        autos[name] = defValue;
        return __assign({}, state, (_a = {}, _a[type] = autos, _a));
    };
    Object.defineProperty(target, KEYS.state, stateDescriptor);
};
export function Action(mutationsFnName, options) {
    return function (target, name, descriptor) {
        var method = descriptor.value;
        var opt = Object.assign({}, defaultActionOptions, options);
        var ret;
        createMapping(target, KEYS.actions, name);
        if (opt.autoLoading) {
            autoCreator(target, name, 'loadings', false);
        }
        if (opt.autoErrors) {
            autoCreator(target, name, 'errors', null);
        }
        descriptor.value = function (context) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            ret = method.apply(target, [context].concat(args));
            if (Object.prototype.toString.call(ret) === '[object Promise]') {
                var data_1;
                var hasAutoLoadingMutation = (target[KEYS.mutations] || []).indexOf(KEYS.loadingMutation) > -1;
                var autoLoadingDispatch_1 = opt.autoLoading === true && hasAutoLoadingMutation;
                if (autoLoadingDispatch_1) {
                    context.commit(KEYS.loadingMutation, { name: name, value: true });
                }
                var hasAutoErrorsMutation = (target[KEYS.mutations] || []).indexOf(KEYS.errorsMutation) > -1;
                var autoErrorsDispatch_1 = opt.autoErrors === true && hasAutoErrorsMutation;
                if (autoErrorsDispatch_1) {
                    context.commit(KEYS.errorsMutation, {
                        name: name,
                        value: null,
                    });
                }
                ret.then(function (res) {
                    if (mutationsFnName) {
                        var names = Array.isArray(mutationsFnName) ? mutationsFnName : [mutationsFnName];
                        [].concat(names).forEach(function (k) {
                            data_1 = opt.autoPayload && res.data ? res.data : res;
                            context.commit(k, data_1);
                        });
                    }
                    if (autoLoadingDispatch_1) {
                        context.commit(KEYS.loadingMutation, { name: name, value: false });
                    }
                }).catch(function (ex) {
                    if (autoLoadingDispatch_1) {
                        context.commit(KEYS.loadingMutation, { name: name, value: false });
                    }
                    if (autoErrorsDispatch_1) {
                        context.commit(KEYS.errorsMutation, {
                            name: name,
                            value: ex,
                        });
                    }
                });
            }
            return ret;
        };
        return descriptor;
    };
}
function StoreDecoratorFactory(Store, options) {
    if (options === void 0) { options = {}; }
    return function () { return ({
        namespaced: true,
        state: getMethods(Store, KEYS.state),
        mutations: getMethods(Store, KEYS.mutations),
        actions: getMethods(Store, KEYS.actions),
        getters: getMethods(Store, KEYS.getters),
    }); };
}
export default function StoreDecorator(options) {
    if (typeof options === 'function') {
        return StoreDecoratorFactory(options);
    }
    return function (Store) {
        return StoreDecoratorFactory(Store, options);
    };
}
