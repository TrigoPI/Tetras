import HttpFunction from "../Manager/HttpFunction";
import ServiceClass from "../Service/ServiceClass";

export type ServiceData = {
    className: string,
    functions: HttpFunction[],
    service: ServiceClass,
}

export type ServiceDesc = {
    port: number
    ip: string,
    name: string, 
    base_path: string,
}