import store from '../demo/store';
import { isContains } from '../util';

expect.extend({
  isContains(arr1: any, arr2: any) {
    const pass =  isContains(arr1, arr2);

    return {
      message: () => pass ? `expected ${arr1} to be divisible by ${arr2}` : `expected ${arr1} to be divisible by ${arr2}`,
      pass,
    };
  },
});

describe("store test", () => {
  it('Check store decorator prototype', () => {
    const all: any = ['namespaced', 'state', 'mutations', 'actions', 'getters'];
    const compare = Object.keys(store);
    (expect(all) as any).isContains(compare);
  });
});
