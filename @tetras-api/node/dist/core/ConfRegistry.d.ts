import { ConfDesc } from "./ConfigType";
export default class ConfRegistry<T> {
    private conf;
    constructor(conf: {
        [P in keyof T]: ConfDesc;
    });
    KeyExist(name: string): boolean;
    Get(name: keyof T): ConfDesc;
    GetAll(): Record<string, ConfDesc>;
    SetAll(conf: Record<string, any>): void;
    Set<K>(name: keyof T, value: K): void;
}
