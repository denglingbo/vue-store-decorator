import { createMapping } from './util';
import { KEYS } from './index';

interface AutoLoadingPayload {
  name: string;
  value: boolean;
}

interface Loadings {
  [prop: string]: boolean;
}

interface State {
  loadings: Loadings;
  [props: string]: any;
}

export default function AutoLoading(target: any) {
  const proto = target.prototype;
  const descriptor: any = Object.getOwnPropertyDescriptor(proto, 'state');

  // 创建 state.loadings
  proto.state = (): State => ({
    loadings: {},
    ...descriptor.value(),
  });

  // 创建映射
  createMapping(proto, KEYS.mutations, KEYS.loadingMutation);
  createMapping(proto, KEYS.getters, 'loadings');

  // 创建 mutations
  proto[KEYS.loadingMutation] = (state: any, payload: AutoLoadingPayload) => {
    const { loadings } = state;
    const { name, value } = payload;

    if (loadings && loadings[name] !== undefined) {
      loadings[name] = value;
    }
  };

  // 创建 getters
  proto.loadings = (state: any) => ({ ...state.loadings });

  return target;
}
