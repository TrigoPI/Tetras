import { Get, Post, Response, Route, Service, ServiceClass, WebString } from "dolphin";
import { CameraName, ImageDesc } from "./type";

@Service("camera-swag", "/camera-swag", "localhost", 4003)
export default class CameraSwag extends ServiceClass {

    @Get
    @Route("/ping")
    public async Ping(): Promise<Response> {
        return Response.Ok();
    }

    @Get
    @Route("/model")
    public async GetModel(): Promise<Response> {
        const name: string = "camera-swag";
        return Response.Json<CameraName>({ name });
    }

    @Get
    @Route("/download/:id")
    public async DownloadImage(
        @WebString("id") id: string
    ): Promise<Response> {
        return Response.Ok();
    }

    @Get
    @Route("/img/list")
    public async GetImageList(): Promise<Response> {
        const imgs: ImageDesc[] = [];
        
        for (let i = 0; i < 10; i++) {
            const name: string = "SC >> SI";
            const dt: number = i;
            const id: string = "01010011 01000011 00100000 00111110 00111110 00100000 01010011 01000011";
        
            imgs.push({ name, dt, id });
        }

        return Response.Json<ImageDesc[]>(imgs);
    }

    @Post
    @Route("/start")
    public async StartCamera(): Promise<Response> {
        return Response.Ok();
    }
}