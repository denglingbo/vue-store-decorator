export declare type ProtoType = '__actions__' | '__mutations__' | '__getters__' | 'state';
interface StoreObjects {
    [props: string]: any;
}
export declare function isContains(arr: Array<string | number>, matchArr: Array<string | number>): boolean;
export declare function getMethods(Store: any, typeName: ProtoType): StoreObjects;
export declare function createMapping(context: any, key: ProtoType, funcName: string): any;
interface StateObject {
    [prop: string]: any;
}
export declare function ObjectDeepUpdater(path: string): {
    get: (obj: StateObject) => StateObject;
    set: (obj: StateObject, value: any) => void;
} | undefined;
export {};
