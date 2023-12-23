import { Get, Logger, Post, Response, Route, SERVICE_MACRO, Service, ServiceClass, WebMacro, WebParam } from "dolphin";
import ConfRegistry from "../../core/ConfRegistry";
import { ConfDesc, Input, Type } from "../../core/ConfigType";
import Conf from "../../core/Conf";

@Service("lora", "/lora", "localhost", 4002)
export default class Lora extends ServiceClass {
    private logger: Logger;
    private registry: ConfRegistry<{
        lora_gateway: ConfDesc
    }>;

    public override async OnStart(): Promise<void> {
        this.logger = new Logger(this.GetName());
        this.registry = new ConfRegistry({
            lora_gateway: {
                type: Type.String,
                input: Input.Text,
                display_name: "LoRa Gateway",
                placeholder: "aa:bb:cc:dd:ee:ff"
            }
        });

        this.registry.SetAll(Conf.SERVICES[this.GetName()]);
    }

    @Get
    @Route("/ping")
    public async Ping(): Promise<Response> {
        return Response.Ok();
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

    @Post
    @Route("/send")
    public async Send(
        @WebMacro(SERVICE_MACRO.PARAMS) params: Record<string, any>
    ): Promise<Response> {
        this.logger.Info("Receving data");
        console.log(params);
        return Response.Ok();
    }
}