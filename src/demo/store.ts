import VuexDecorator, {
  Action,
  Mutation,
  Getter,
  AutoLoading,
  AutoErrors,
} from '../index';

function mockReq(mockSuccess: boolean, delay: number = 2000) {
  return new Promise((resolve: any, reject: any) => {
    setTimeout(() => {

      if (mockSuccess) {
        resolve({
          data: {
            name: 'deo',
          },
        });
      } else {
        reject({
          error: 'i\'m error.',
        });
      }
    }, delay);
  });
}

@VuexDecorator
@AutoLoading
@AutoErrors
class Store {
  public state() {
    return {
      name: 'nobody',
      level: {
          age: 'level age',
      },
      age: 0,
    };
  }

  @Getter
  public info(state: any) {
    return `Name: ${state.name} - Age+1: ${state.age + 1}`;
  }

  @Mutation('name')
  public changeName(state: any, { name }: any) {
    return name;
  }

  @Action('changeName', { autoLoading: false })
  public async fetch(context: any, params: any) {
    const res: any = await mockReq(true);
    return res.data;
  }

  @Action()
  public async testError(context: any, params: any) {
    const res: any = await mockReq(false, 1000);
    return res;
  }
}

export default new Store();
