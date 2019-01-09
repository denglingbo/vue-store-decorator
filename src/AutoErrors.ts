import { createMapping } from './util';
import { KEYS } from './index';

interface AutoErrorPayload {
  name: string;
  value: any;
}

interface Errors {
  [prop: string]: any;
}

interface State {
  errors: Errors;
  [props: string]: any;
}

export default function AutoErrors(target: any) {
  const proto = target.prototype;
  const descriptor: any = Object.getOwnPropertyDescriptor(proto, 'state');

  // 创建 state.errors
  proto.state = (): State => ({
    errors: {},
    ...descriptor.value(),
  });

  // 创建映射
  createMapping(proto, KEYS.mutations, KEYS.errorsMutation);
  createMapping(proto, KEYS.getters, 'errors');

  // 创建 mutations
  proto[KEYS.errorsMutation] = (state: any, payload: AutoErrorPayload) => {
    const { errors } = state;
    const { name, value } = payload;

    if (errors && errors[name] !== undefined) {
      errors[name] = value;
    }
  };

  // 创建 getters
  proto.errors = (state: any) => ({ ...state.errors });

  return target;
}
