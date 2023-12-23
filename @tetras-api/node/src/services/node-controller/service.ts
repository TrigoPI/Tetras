import { Get, Logger, Post, Response, Route, SERVICE_MACRO, Service, ServiceClass, WebMacro } from "dolphin";

import ConfRegistry from "../../core/ConfRegistry";
import { ConfDesc, Input, Type } from "../../core/ConfigType";
import Conf from "../../core/Conf";
import { HttpResponse, RestClient } from "rest-client";
import { LoRaData } from "./type";

@Service("node-controller", "/node-controller", "localhost", 4000)
export default class NodeController extends ServiceClass {
    private logger: Logger;
    private servicesName: string[];
    private servicesOnline: Map<string, boolean>;
    private intervalId: NodeJS.Timeout[];

    private registry: ConfRegistry<{
        camera_path  : ConfDesc,
        camera_ip    : ConfDesc,
        camera_port  : ConfDesc,
        gateway_path : ConfDesc,
        gateway_ip   : ConfDesc,
        gateway_port : ConfDesc
    }>;
    
    public override async OnStart(): Promise<void> {
        this.intervalId = [];
        this.servicesOnline = new Map<string, boolean>();
        this.logger = new Logger(this.GetName());

        this.servicesName = [
                "camera", 
                "gateway"
        ];
        
        this.registry = new ConfRegistry({
            camera_path: {
                type: Type.String,
                input: Input.Text,
                display_name: "Camera Path", 
                placeholder: "/camera"
            },
            camera_ip: { 
                type: Type.String,
                input: Input.Text, 
                display_name: "Camera IP", 
                placeholder: "localhost"
            },
            camera_port: { 
                type: Type.Number,
                input: Input.Text, 
                display_name: "Camera Port", 
                placeholder: "4000"
            },
            gateway_path: {
                type: Type.String,
                input: Input.Text,
                display_name: "Gateway Path",
                placeholder: "/gateway"
            },
            gateway_ip: {
                type: Type.String,
                input: Input.Text,
                display_name: "Gateway IP",
                placeholder: "localhost"
            },
            gateway_port: {
                type: Type.Number,
                input: Input.Text,
                display_name: "Gateway Port",
                placeholder: "4000"
            }
        });

        this.registry.SetAll(Conf.SERVICES[this.GetName()]);
        this.InitServicesOnline();
        this.PingService("camera", "camera_path", "camera_ip", "camera_port");
        this.PingService("gateway", "gateway_path", "gateway_ip", "gateway_port");
    }
    
    public override async OnStop(): Promise<void> {
        for (const id of this.intervalId) clearInterval(id);
    }

    private InitServicesOnline(): void {
        for (const name of this.servicesName) this.servicesOnline.set(name, false);
    }

    private PingService(name: string, path: string, ip: string, port: string): void {
        if (!Conf.SERVICES[this.GetName()][path]) return;
        if (!Conf.SERVICES[this.GetName()][ip]) return;
        if (!Conf.SERVICES[this.GetName()][port]) return;

        const url: string = `http://${Conf.SERVICES[this.GetName()][ip]}:${Conf.SERVICES[this.GetName()][port]}${Conf.SERVICES[this.GetName()][path]}/ping`;
        let failed: number = 0;

        const id: NodeJS.Timeout = setInterval(async () => {
            try {
                this.logger.Print(`Trying to ping ${url}`);
                await RestClient.Get(url);

                this.logger.Info(`${url} online`);
                this.servicesOnline.set(name, true);
                
                await this.OnServiceOnline(name);
                clearInterval(id);
            } catch {
                failed++;
                this.logger.Warning(`${url} unreachable`);
                if (failed != 5) return;

                this.logger.Error(`Ping ${url}, 5 try failed`);
                this.servicesOnline.set(name, true);
                clearInterval(id);
            } 
        }, 3000);

        this.intervalId.push(id);
    }

    private async OnServiceOnline(name: string): Promise<void> {
        for (const serviceName of this.servicesName) {
            if (!this.servicesOnline.get(serviceName)) return;
        }

        await this.OnAllServicesOnline();
    }

    private async OnAllServicesOnline(): Promise<void> {
        try {
            const imgResponse: HttpResponse = await RestClient.Get(`http://${Conf.SERVICES[this.GetName()]["camera_ip"]}:${Conf.SERVICES[this.GetName()]["camera_port"]}${Conf.SERVICES[this.GetName()]["camera_path"]}/img/list`);
            const date: string = new Date().toISOString();
            const camera: Record<string, any> = imgResponse.Json();
            const datas: LoRaData = { camera, date };
            await RestClient.Post(`http://${Conf.SERVICES[this.GetName()]["gateway_ip"]}:${Conf.SERVICES[this.GetName()]["gateway_port"]}${Conf.SERVICES[this.GetName()]["gateway_path"]}/send`, datas);
        } catch (e: any){
            this.logger.Error(e);
        }
    }

    @Get
    @Route("/configuration")
    public async GetConfiguration(): Promise<Response> {
        const conf: Record<string, ConfDesc> = this.registry.GetAll();
        return Response.Json<Record<string, ConfDesc>>(conf);    
    }

    @Post
    @Route("/configuration/save")
    public async SaveConfiguration(
        @WebMacro(SERVICE_MACRO.PARAMS) params: Record<string, any>
    ): Promise<Response> {
        for (const key in params) {
            if (this.registry.KeyExist(key)){
                this.registry.Set(<any>key, params[key]);
            }
        }
        
        await Conf.Write(this.GetName(), this.registry.GetAll());

        return Response.Ok();
    }
}