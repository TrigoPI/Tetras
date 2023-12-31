import { Get, Logger, Post, Response, Route, SERVICE_MACRO, Service, ServiceClass, ServiceLuncher, WebMacro, WebString } from "dolphin";
import { HttpResponse, RestClient } from "rest-client";

import { ServiceDesc } from "dolphin/dist/types/service-module-types";

import { ConfDesc, Input, Type } from "../../core/ConfigType";
import Conf from "../../core/Conf";
import ConfRegistry from "../../core/ConfRegistry";

@Service("api-core", "/api-core", Conf.SERVICES["api-core"]["ip"], Conf.SERVICES["api-core"]["port"])
export default class ApiCore extends ServiceClass {
    private luncher: ServiceLuncher;
    private logger: Logger;

    private registry: ConfRegistry<{
        ip: ConfDesc,
        port: ConfDesc,
        auto_start: ConfDesc
    }>
    
    public override async OnStart(): Promise<void> {
        this.luncher = ServiceLuncher.GetInstance();
        this.logger = new Logger(this.GetName());

        this.registry = new ConfRegistry({
            port: { 
                type: Type.Number,
                input: Input.Text,
                display_name: "Port",
                placeholder: "8080"
            },
            
            ip: { 
                type: Type.String,
                input: Input.Text, 
                display_name: "IP", 
                placeholder: "localhost" 
            },

            auto_start: {
                type: Type.String,
                input: Input.Checkbox,
                display_name: "Auto Start",
                placeholder: "",
                checkboxes: this.luncher.GetServiceNames().filter((value: string) => value != this.GetName())
            }
        });

        this.registry.SetAll(Conf.SERVICES[this.GetName()]);
        await this.StartSubServices();
    }

    private async StartSubServices(): Promise<void> {
        if (!Conf.SERVICES["api-core"]["auto_start"]) return;
        
        for (let name of Conf.SERVICES["api-core"]["auto_start"]) {
            if (this.luncher.ServiceExist(name)) {
                try { await this.luncher.StartService(name); } 
                catch (e: any) { this.logger.Error(e); }
            } else {
                this.logger.Error(`Cannot find service ${name}`);
            }
        }
    }

    @Get
    @Route("/service/names")
    public async GetServicesDesc(): Promise<Response> {
        const desc: ServiceDesc[] = this.luncher.GetServicesDesc();
        return Response.Json<ServiceDesc[]>(desc);
    }

    @Get
    @Route("/service/configuration/:name")
    public async GetServiceConfiguration(
        @WebString("name") name: string
    ): Promise<Response> {
        if (!this.luncher.ServiceExist(name)) return Response.NotFound();
        if (!this.luncher.IsRunning(name)) return Response.NotFound();

        if (name == this.GetName()) {
            const confDesc: Record<string, ConfDesc> = this.registry.GetAll();
            return Response.Json<Record<string, ConfDesc>>(confDesc);
        } 
        
        try {
            const service: ServiceDesc = this.luncher.GetService(name);
            const res: HttpResponse = await RestClient.Get(`http://${service.ip}:${service.port}${service.base_path}/configuration`);
            const json: Record<string, Type> = res.Json<Record<string, Type>>();
            return Response.Json<Record<string, Type>>(json);
        } catch (e: any) {
            return Response.NotFound()
        }
    }

    @Post
    @Route("/service/configuration/save/:name")
    public async SaveServiceConfiguration(
        @WebString("name") name: string,
        @WebMacro(SERVICE_MACRO.PARAMS) params: Record<string, any>
    ): Promise<Response> {
        if (!this.luncher.ServiceExist(name)) return Response.NotFound();
        if (!this.luncher.IsRunning(name)) return Response.NotFound();

        if (name == this.GetName()) {
            for (const key in params) {
                if (this.registry.KeyExist(key)){
                    this.registry.Set(<any>key, params[key]);
                }
            }
            
            await Conf.Write(this.GetName(), this.registry.GetAll());
            
            return Response.Ok();
        } 
        
        try {
            const service: ServiceDesc = this.luncher.GetService(name);
            await RestClient.Post(`http://${service.ip}:${service.port}${service.base_path}/configuration/save`, params);
            return Response.Ok();
        } catch (e: any) {
            return Response.NotFound()
        }
    }

    @Post
    @Route("/service/start/:name")
    public async StartService(
        @WebString("name") name: string
    ): Promise<Response> {
        if (!this.luncher.ServiceExist(name)) return Response.NotFound();
        if (this.luncher.IsRunning(name)) return Response.Conflict();
        await this.luncher.StartService(name);
        return Response.Ok();
    }

    @Post
    @Route("/service/stop/:name")
    public async StopService(
        @WebString("name") name: string
    ): Promise<Response> {
        if (name == this.GetName()) return Response.Unauthorized();
        if (!this.luncher.ServiceExist(name)) return Response.NotFound();
        if (!this.luncher.IsRunning(name)) return Response.Conflict();
        await this.luncher.StopService(name);
        return Response.Ok();
    }

    @Post
    @Route("/service/reload/:name")
    public async ReloadService(
        @WebString("name") name: string
    ): Promise<Response> {
        if (name == this.GetName()) return Response.Unauthorized();
        if (!this.luncher.ServiceExist(name)) return Response.NotFound();
        await this.luncher.ReloadService(name);
        return Response.Ok();
    }
}