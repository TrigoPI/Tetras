import { Get, MediaType, Post, Response, Route, Service, ServiceClass, ServiceLuncher, WebString } from "dolphin";
import { ServiceDesc } from "dolphin/dist/types/service-module-types";

@Service("controller", "/controller", "localhost", 8000)
export default class Controller extends ServiceClass {
    private luncher: ServiceLuncher
    
    public constructor() {
        super()
        this.luncher = ServiceLuncher.GetInstance();
    }

    @Get
    @Route("/service/names")
    public async GetServicesDesc(): Promise<Response> {
        const desc: ServiceDesc[] = this.luncher.GetServicesDesc();
        return Response.Json<ServiceDesc[]>(desc);
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
        if (!this.luncher.ServiceExist(name)) return Response.NotFound();
        if (!this.luncher.IsRunning(name)) return Response.Conflict();
        await this.luncher.StopService(name);
        return Response.Ok();
    }
}