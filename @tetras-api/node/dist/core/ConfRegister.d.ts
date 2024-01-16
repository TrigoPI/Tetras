import { Type } from "./ConfigType";
export default class ConfRegistery {
    private conf;
    constructor();
    Register(conf: Record<string, Type>): void;
    Get(name: string): Type;
    GetAll(): Record<string, Type>;
}
