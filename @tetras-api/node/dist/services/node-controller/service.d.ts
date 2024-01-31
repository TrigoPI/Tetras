import { Response, ServiceClass } from "dolphin";
export default class NodeController extends ServiceClass {
    private logger;
    private servicesName;
    private servicesOnline;
    private intervalId;
    private registry;
    OnStart(): Promise<void>;
    OnStop(): Promise<void>;
    private InitServicesOnline;
    private PingService;
    private OnServiceOnline;
    private OnAllServicesOnline;
    GetConfiguration(): Promise<Response>;
    SaveConfiguration(params: Record<string, any>): Promise<Response>;
}
