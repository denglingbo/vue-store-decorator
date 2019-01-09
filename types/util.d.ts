export declare type ProtoType = '__actions__' | '__mutations__' | '__getters__' | 'state';
export declare function getMethods(Store: ObjectConstructor, typeName: ProtoType): any;
export declare function createMapping(context: any, key: ProtoType, funcName: string): void;
interface StateObject {
    [prop: string]: any;
}
export declare function ObjectDeepUpdater(path: string): {
    get: (obj: StateObject) => StateObject;
    set: (obj: StateObject, value: any) => void;
} | undefined;
export {};
