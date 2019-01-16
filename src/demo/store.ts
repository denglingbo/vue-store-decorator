import StoreDecorator, {
  Action,
  Mutation,
  Getter,
  AutoLoading,
  AutoErrors,
} from '../index';
import mockReq from './mockReq';

@StoreDecorator
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

  @Action('changeName', { autoLoading: true })
  public async fetch(context: any, params: any) {
    const res: any = await mockReq(true);
    return res.data;
  }

  @Action()
  public async testError(context: any, params: any) {
    const res: any = await mockReq(true, 1000);
    return res;
  }
}

const store: any = new Store();

export default store;
