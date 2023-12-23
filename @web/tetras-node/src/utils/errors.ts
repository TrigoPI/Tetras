import { Exception } from "exception";

export enum AppErrors {
    INVALID_TYPE = "INVALID_TYPE"
}

export class InvalidTypeError extends Exception {
    public constructor(value: any, type: string) {
        super(`value "${value}" is not typeof ${type}`, AppErrors.INVALID_TYPE, { value, type });
    }
}