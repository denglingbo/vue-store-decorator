import AutoLoading from './AutoLoading';
import AutoErrors from './AutoErrors';
import { ProtoType } from './util';
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
declare const KEYS: KeyTypes;
export { AutoLoading, AutoErrors, KEYS };
export declare function Getter(target: any, name: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
export declare function Mutation(stateName?: string): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export declare function Action(mutationsFnName?: string | string[], options?: DefaultActionOptions): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export default function StoreDecorator(options?: any): any;
