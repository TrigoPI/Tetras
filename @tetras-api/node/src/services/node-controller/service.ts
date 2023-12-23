import { Get, Post, Response, Route, SERVICE_MACRO, Service, ServiceClass, WebMacro } from "dolphin";

import ConfRegistery from "../../core/ConfRegistery";
import { ConfDesc, Input, Type } from "../../core/ConfigType";
import Conf from "../../core/Conf";

@Service("node-controller", "/node-controller", "localhost", 4000)
export default class NodeController extends ServiceClass {
    private registery: ConfRegistery<{
        camera_path : ConfDesc,
        camera_ip   : ConfDesc,
        camera_port : ConfDesc
    }>;
    
    public override async OnStart(): Promise<void> {
        this.registery = new ConfRegistery({
            camera_path: { 
                type: Type.String,
                input: Input.Text,
                display_name: "Camera Path", 
                placeholder: '/camera'
            },
            camera_ip: { 
                type: Type.String,
                input: Input.Text, 
                display_name: "Camera IP", 
                placeholder: 'localhost'
            },
            camera_port: { 
                type: Type.Number,
                input: Input.Text, 
                display_name: "Camera Port", 
                placeholder: '4000' 
            }
        });

        this.registery.SetAll(Conf.SERVICES["node-controller"]);
    }

    @Get
    @Route("/configuration")
    public async GetConfiguration(): Promise<Response> {
        const conf: Record<string, ConfDesc> = this.registery.GetAll();
        return Response.Json<Record<string, ConfDesc>>(conf);    
    }

    @Post
    @Route("/configuration/save")
    public async SaveConfiguration(
        @WebMacro(SERVICE_MACRO.PARAMS) params: Record<string, any>
    ): Promise<Response> {
        for (const key in params) {
            if (this.registery.KeyExist(key)){
                this.registery.Set(<any>key, params[key]);
                Conf.Write("node-controller", this.registery.GetAll())
            }
        }

        return Response.Ok();
    }
}