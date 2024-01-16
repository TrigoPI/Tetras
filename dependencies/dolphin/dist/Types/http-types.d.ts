import { Response } from "../Server/Response";
export type ParamType = "string" | "object" | "number";
export type HttpMethod = "post" | "get";
export type HttpHandler = (...args: any[]) => Promise<Response>;
export type Param = {
    type: ParamType;
    name: string;
    index: number;
};
