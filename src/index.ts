/**
 * @file index.ts
 * @author denglingbo
 *
 * stores-decorator
 */
'use strict';
import AutoLoading from './AutoLoading';
import AutoErrors from './AutoErrors';
import { createMapping, getMethods, ProtoType, ObjectDeepUpdater } from './util';

interface IOptions {
  namespaced?: boolean;
}

interface DefaultActionOptions {
  autoLoading?: boolean;
  autoErrors?: boolean;
  autoPayload?: boolean;
}

interface KeyTypes {
  state: ProtoType;
  actions: ProtoType;
  mutations: ProtoType;
  getters: ProtoType;
  [prop: string]: any;
}

const KEYS: KeyTypes = {
  state: 'state',
  actions: '__actions__',
  mutations: '__mutations__',
  getters: '__getters__',
  loadingMutation: 'onLoadingStateChange',
  errorsMutation: 'onErrorStateChange',
};

export { AutoLoading, AutoErrors, KEYS };

/**
 * 用于多处需要使用的计算缓存使用
 */
export function Getter(target: any, name: string, descriptor: TypedPropertyDescriptor<any>) {
  createMapping(target, KEYS.getters, name);

  return descriptor;
}

/**
 * 同步更新 name 被作为 Action Key 与 @Action 进行关联
 *
 * @param stateName state.$key = ...
 */
export function Mutation(stateName?: string) {
  return (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => {
    const method = descriptor.value;
    let ret;

    createMapping(target, KEYS.mutations, name);

    descriptor.value = (state: any, ...args: any[]) => {
      ret = method.apply(target, [state, ...args]);

      if (stateName) {
        const updater = ObjectDeepUpdater(stateName);

        if (updater) {
          const oldValue = updater.get(state);
          const oldType = Object.prototype.toString.call(oldValue);
          const newType = Object.prototype.toString.call(ret);

          if (process.env.NODE_ENV !== 'production' && newType !== oldType) {
            console.error(`[Store-decorator warn]: old type: (${oldType}) -> new type: (${newType}). `
              + `mutation: (${name}), path: (${stateName}).`);
          }

          updater.set(state, ret);
        }
      }

      return ret;
    };

    return descriptor;
  };
}

const defaultActionOptions: DefaultActionOptions = {
  autoLoading: true,
  autoErrors: true,
  // 自动 context.commit(k, res.data)
  autoPayload: true,
};

type CreateType = 'loadings' | 'errors';

/**
 * 创建 loading or errors 的 state 默认数据节点
 * @param target target
 * @param name name
 * @param type type
 * @param defValue default value
 */
const autoCreator = (target: any, name: string, type: CreateType, defValue: any) => {
  const stateDescriptor: any = Object.getOwnPropertyDescriptor(target, KEYS.state);

  if (stateDescriptor === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[Store-decorator warn]: autoCreator: stateDescriptor null`);
    }
    return;
  }

  const state: any = stateDescriptor.value();

  stateDescriptor.value = () => {
    const autos = state[type] || {};
    autos[name] = defValue;
    return { [type]: autos, ...state };
  };

  Object.defineProperty(target, KEYS.state, stateDescriptor);
};

/**
 * 异步更新
 *
 * @param mutationsFnName @Action($mutationsFnName) | @Action([$mutationsFnName, $mutationsFnName1])
 */
export function Action(mutationsFnName?: string | string[], options?: DefaultActionOptions) {
  return (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => {
    const method = descriptor.value;
    const opt: DefaultActionOptions = Object.assign({}, defaultActionOptions, options);
    let ret;

    createMapping(target, KEYS.actions, name);

    if (opt.autoLoading) {
      autoCreator(target, name, 'loadings', false);
    }

    if (opt.autoErrors) {
      autoCreator(target, name, 'errors', null);
    }

    descriptor.value = (context: any, ...args: any[]) => {
      ret = method.apply(target, [context, ...args]);

      if (Object.prototype.toString.call(ret) === '[object Promise]') {
        let data: any;

        // <自动创建 loading mutation>
        // 判断 mutations 上是否存在处理 loadings 的方法
        const hasAutoLoadingMutation: boolean = (target[KEYS.mutations] || []).indexOf(KEYS.loadingMutation) > -1;
        const autoLoadingDispatch: boolean = opt.autoLoading === true && hasAutoLoadingMutation;
        // if <auto loading> state.loadings.$funcName
        if (autoLoadingDispatch) {
          // loadingDispatch(context, opt.autoLoading, name, true);
          context.commit(KEYS.loadingMutation, { name, value: true });
        }

        // <自动创建 errors mutation>
        // 判断 mutations 上是否存在处理 errors 的方法
        // 如果 store Action 模块中添加过 try catch 且 catch 并未返回 promise.reject 则内部不进行自动处理
        const hasAutoErrorsMutation: boolean = (target[KEYS.mutations] || []).indexOf(KEYS.errorsMutation) > -1;
        const autoErrorsDispatch: boolean = opt.autoErrors === true && hasAutoErrorsMutation;

        // if <auto loading> state.loadings.$funcName
        if (autoErrorsDispatch) {
          context.commit(KEYS.errorsMutation, {
            name,
            value: null,
          });
        }

        ret.then((res: any) => {
          if (mutationsFnName) {
            const names: any = Array.isArray(mutationsFnName) ? mutationsFnName : [mutationsFnName];

            [].concat(names).forEach((k: string) => {
              data = opt.autoPayload && res.data ? res.data : res;
              context.commit(k, data);
            });
          }

          if (autoLoadingDispatch) {
            // loadingDispatch(context, opt.autoLoading, name, false);
            context.commit(KEYS.loadingMutation, { name, value: false });
          }
        }).catch((ex: Error) => {
          if (autoLoadingDispatch) {
            // loadingDispatch(context, opt.autoLoading, name, false);
            context.commit(KEYS.loadingMutation, { name, value: false });
          }

          if (autoErrorsDispatch) {
            context.commit(KEYS.errorsMutation, {
              name,
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

function StoreDecoratorFactory(Store: any, options: IOptions = {}) {
  return () => ({
    namespaced: true,
    state: getMethods(Store, KEYS.state),
    mutations: getMethods(Store, KEYS.mutations),
    actions: getMethods(Store, KEYS.actions),
    getters: getMethods(Store, KEYS.getters),
  });
}

/**
 *
 * @param options
 *  1. @StoreDecorator
 *    Class xxx
 *    options: {undefined}
 *  2. @StoreDecorator(...)
 *    Class xxx
 *    options: {function}
 */
export default function StoreDecorator(options?: any): any {
  if (typeof options === 'function') {
    return StoreDecoratorFactory(options);
  }

  return (Store: any) => {
    return StoreDecoratorFactory(Store, options);
  };
}
