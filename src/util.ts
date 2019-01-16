/**
 * 获取对应的类型的 store actions, mutations, getters
 *
 * @param context
 * @param type 要查找的 proto 上的属性
 */
export type ProtoType =
  | '__actions__'
  | '__mutations__'
  | '__getters__'
  | 'state';

import { KEYS } from './index';

interface StoreObjects {
  [props: string]: any;
}

export function isContains(arr: Array<string | number>, matchArr: Array<string | number>): boolean {
  if (
    !(arr instanceof Array) ||
    !(matchArr instanceof Array) ||
    arr.length === 0 ||
    matchArr.length === 0 ||
    arr.length < matchArr.length
  ) {
    return false;
  }

  for (const item of matchArr) {
    if (arr.indexOf(item) === -1) {
      return false;
    }
  }

  return true;
}

export function getMethods(Store: any, typeName: ProtoType): StoreObjects {
  let methods: StoreObjects = {};
  let descriptor: any;
  let proto: any = Store.prototype;
  const protertyNames: string[] = Object.getOwnPropertyNames(proto);
  const mactcherProtos = [KEYS.actions, KEYS.mutations, KEYS.getters];

  // 如果原型上不存在，
  // class Store extends ParentStore {}
  // TODO extens???
  if (!isContains(protertyNames, mactcherProtos) && !isContains(mactcherProtos, protertyNames)) {
    proto = proto.__proto__;
  }

  Object.getOwnPropertyNames(proto).forEach((key: string) => {
    if (key === typeName) {
      // function names
      const names = proto[key];

      if (typeof names === 'function') {
        descriptor = Object.getOwnPropertyDescriptor(proto, key);
        methods = descriptor.value;
      } else {
        names.forEach((name: string) => {
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

/**
 * 创建映射
 *
 * @param context es5.lib -> Object
 * @param key
 * @param funcName
 */
export function createMapping(context: any, key: ProtoType, funcName: string) {
  if (!context[key]) {
    context[key] = [];
  }

  context[key].push(funcName);

  return context;
}

interface StateObject {
  [prop: string]: any;
}

/**
 * Parse simple object path
 * Object: obj = { a: 1, b: { b1: 'b1' } }, Mutation('obj.b')
 */
const bailRE = /[^\w.$]/;

export function ObjectDeepUpdater(path: string) {
  if (bailRE.test(path)) {
    return;
  }

  const segments = path.split('.');

  return {
    get: (obj: StateObject) => {
      segments.forEach((key: string) => {
        if (!obj) {
          return;
        }

        obj = obj[key];
      });

      return obj;
    },

    set: (obj: StateObject, value: any) => {
      let property;
      let setter: any = null;

      segments.forEach((key: string) => {
        if (!obj) {
          return;
        }

        property = Object.getOwnPropertyDescriptor(obj, key);
        setter = property && property.set ? property.set : null;
        console.log(property, obj, key, setter)
        obj = obj[key];
      });

      if (process.env.NODE_ENV !== 'production' && !setter) {
        console.error(
          `[Store-decorator warn]: property.set: (${path}) not found`
        );
      }

      if (setter !== null) {
        setter.call(obj, value);
      }
    }
  };
}
