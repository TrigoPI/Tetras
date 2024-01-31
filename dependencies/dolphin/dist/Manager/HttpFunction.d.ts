import { HttpMethod, Param, ParamType } from "../Types/http-types";
export default class HttpFunction {
    private name;
    private method;
    private route;
    private params;
    constructor(name: string);
    GetParams(): Param[];
    GetMethod(): HttpMethod;
    GetRoute(): string;
    GetName(): string;
    HasRoute(): boolean;
    HasMethod(): boolean;
    SetMethod(method: HttpMethod): void;
    SetRoute(route: string): void;
    AddParam(name: string, type: ParamType, index: number): void;
}
