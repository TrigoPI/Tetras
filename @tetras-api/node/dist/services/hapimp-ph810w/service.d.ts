import { Response, ServiceClass } from "dolphin";
export default class HapimpPh810w extends ServiceClass {
    private name;
    constructor();
    Ping(): Promise<Response>;
    GetModel(): Promise<Response>;
    GetImageList(): Promise<Response>;
}
