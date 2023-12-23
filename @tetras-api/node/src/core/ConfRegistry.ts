import { ConfDesc, Type } from "./ConfigType";

export default class ConfRegistry<T> {
    private conf: { [ P in keyof T ]: ConfDesc };

    public constructor(conf: { [ P in keyof T ]: ConfDesc }) {
        this.conf = conf;
    }

    public KeyExist(name: string): boolean {
        return this.conf[name] != undefined
    }

    public Get(name: keyof T): ConfDesc {
        const desc: ConfDesc | undefined = this.conf[name];
        if (!desc) throw new Error(`${<string>name} not found`);
        return desc;
    }

    public GetAll(): Record<string, ConfDesc> {
        return this.conf;
    }

    public SetAll(conf: Record<string, any>): void {
        for (const key in conf) this.Set(<keyof T>key, conf[key]);
    }

    public Set<K>(name: keyof T, value: K): void {
        const desc: ConfDesc | undefined = this.conf[name];
        if (!desc) throw new Error(`${<string>name} not found`);
        this.conf[name].value = value;
    }
}