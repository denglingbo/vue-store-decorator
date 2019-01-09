/**
 * 获取对应的类型的 store actions, mutations, getters
 *
 * @param context
 * @param type 要查找的 proto 上的属性
 */
export type ProtoType = '__actions__' | '__mutations__' | '__getters__' | 'state';

export function getMethods(Store: ObjectConstructor, typeName: ProtoType) {
  let methods: any = {};
  let descriptor: any;
  const proto: any = Store.prototype;

  Object.getOwnPropertyNames(proto).forEach((key: string) => {
    if (key === typeName) {
      // function names
      const names = proto[key];

      if (typeof names === 'function') {
        descriptor = Object.getOwnPropertyDescriptor(proto, key);
        methods = descriptor.value;
      } else {
        names.forEach((name: string) => {
          descriptor = Object.getOwnPropertyDescriptor(proto, name);
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

        obj = obj[key];
      });

      if (process.env.NODE_ENV !== 'production' && !setter) {
        console.error(`[Store-decorator warn]: property.set: (${path}) not found`);
      }

      if (setter !== null) {
        setter.call(obj, value);
      }
    },
  };
}
