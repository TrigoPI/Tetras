import { Response, ServiceClass } from "dolphin";
export default class ApiCore extends ServiceClass {
    private luncher;
    private logger;
    private registry;
    OnStart(): Promise<void>;
    private StartSubServices;
    GetServicesDesc(): Promise<Response>;
    GetServiceConfiguration(name: string): Promise<Response>;
    SaveServiceConfiguration(name: string, params: Record<string, any>): Promise<Response>;
    StartService(name: string): Promise<Response>;
    StopService(name: string): Promise<Response>;
    ReloadService(name: string): Promise<Response>;
}
