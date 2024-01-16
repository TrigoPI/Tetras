export default class Exception extends Error {
    static ERROR: string;
    readonly type: string;
    readonly context: Record<string, any>;
    constructor(msg: string, type: string, context?: Record<string, any>);
    GetError<T extends Error>(): T;
    InstanceOf<T extends new (...arg: any[]) => Error>(a: T): boolean;
    ToString(): string;
    static EnsureError(err: any): Exception;
}
