import ServiceLoader from "../Loader/ServiceLoader";
import HttpFunction from "../Manager/HttpFunction";
import HttpServerManager from "../Manager/HttpServerManager";
import ServiceClass from "../Service/ServiceClass";
import Logger from "../lib/Log/Logger";
import { Param } from "../types/http-types";
import { ServiceData, ServiceDesc } from "../types/service-module-types";

export default class ServiceLuncher {
    private static sInstance: ServiceLuncher | undefined;

    private logger: Logger;
    private httpServerManager: HttpServerManager;
    private services: Map<string, ServiceData>;
    private servicePath: string;

    public constructor(servicePath: string) {
        this.servicePath = servicePath;
        this.httpServerManager = new HttpServerManager();
        this.services = new Map<string, ServiceData>();
        this.logger = new Logger(ServiceLuncher.name);
    }

    public IsRunning(name: string): boolean {
        if (!this.services.has(name)) throw new Error(`Cannot find service ${name}`);
        const service: ServiceData = this.services.get(name);
        return this.httpServerManager.IsRunning(service.service.GetIp(), service.service.GetPort());
    }

    public ServiceExist(name: string): boolean {
        return this.services.has(name);
    }

    public GetServicesDesc(): ServiceDesc[] {
        const names: ServiceDesc[] = [];
        this.services.forEach((value: ServiceData, name: string) => {
            const ip: string = value.service.GetIp();
            const base_path: string = value.service.GetRoute();
            const port: number = value.service.GetPort();
            names.push({ name, ip, port, base_path })
        });
        return names;
    }

    public GetServiceNames(): string[] {
        const names: string[] = [];
        this.services.forEach((_, key: string) => names.push(key));
        return names; 
    }

    public async LoadServices(): Promise<void> {
        const servicesLoader: ServiceLoader = new ServiceLoader(this.servicePath);
        const services: ServiceData[] = await servicesLoader.Load();
        services.forEach((value: ServiceData) => { 
            this.services.set(value.service.GetName(), value)
            this.CreateHttpServers(value);
        });
    }

    public async StopService(name: string): Promise<void> {
        if (!this.services.has(name)) throw new Error(`Cannot find service ${name}`);
        const service: ServiceData = this.services.get(name);
        await this.OnStopService(service);
        await this.httpServerManager.Stop(service.service.GetIp(), service.service.GetPort());
    }

    public async StopAllService(): Promise<void> {
        for (const [_, service] of this.services) await this.OnStopService(service)
        await this.httpServerManager.StopAll();        
    }

    public async StartService(name: string): Promise<void> {
        if (!this.services.has(name)) throw new Error(`Cannot find service ${name}`);
        const service: ServiceData = this.services.get(name);
        await this.OnStartServices(service);
        await this.httpServerManager.Start(service.service.GetIp(), service.service.GetPort());
    }

    public async StartAllService(): Promise<void> {
        for (const [_, service] of this.services) await this.OnStartServices(service)
        await this.httpServerManager.StartAll();      
    }

    private async OnStopService(data: ServiceData): Promise<void> {
        try {
            await data.service.OnStart();
        } catch (err: any) {
            this.logger.Error(`Failed to execute OnStop ${data.service.GetName()}`);
            this.logger.Error(err);
        }
    }

    private async OnStartServices(data: ServiceData): Promise<void> {
        try {
            await data.service.OnStart();
        } catch (err: any) {
            this.logger.Error(`Failed to execute OnStart ${data.service.GetName()}`);
            this.logger.Error(err);
        }
    }

    private CreateHttpServers(data: ServiceData): void {
        const service: ServiceClass = data.service;
        const functions: HttpFunction[] = data.functions;

        this.httpServerManager.CreateServer(service.GetIp(), service.GetPort());
        this.httpServerManager.AddRouter(service.GetIp(), service.GetPort(), service.GetRoute());
        
        functions.forEach((httpFunction: HttpFunction) => {
            const params: Param[] = httpFunction.GetParams();

            this.httpServerManager.AddSubRoute(
                service.GetIp(), 
                service.GetPort(), 
                service.GetRoute(), 
                httpFunction.GetRoute(), 
                httpFunction.GetMethod(),
                httpFunction.GetName(),
                (...args: any[]) => service[httpFunction.GetName()](...args)
            );

            this.httpServerManager.SetParam(
                service.GetIp(), 
                service.GetPort(), 
                service.GetRoute(),
                httpFunction.GetRoute(),
                httpFunction.GetMethod(),
                params
            );
        });
    }

    public static GetInstance(): ServiceLuncher {
        if (!ServiceLuncher.sInstance) throw new Error("Luncher already not created");
        return ServiceLuncher.sInstance;
    }

    public static Create(servicePath: string): void {
        if (ServiceLuncher.sInstance) throw new Error("Luncher already created");
        ServiceLuncher.sInstance = new ServiceLuncher(servicePath);
    }
}