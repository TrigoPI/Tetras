import { Response, ServiceClass } from "dolphin";
export default class Lora extends ServiceClass {
    private logger;
    private registry;
    OnStart(): Promise<void>;
    Ping(): Promise<Response>;
    GetConfiguration(): Promise<Response>;
    SaveConfiguration(params: Record<string, any>): Promise<Response>;
    Send(params: Record<string, any>): Promise<Response>;
}
