import { Get, MediaType, Response, Route, Service, ServiceClass, Status } from "dolphin";
import { CameraName, ImageDesc } from "./type";
import { randomUUID } from "crypto";

@Service("hapimp-ph810w", "/camera", "localhost", 4001)
export default class HapimpPh810w extends ServiceClass {
    private name: string;
    
    public constructor() {
        super();
        this.name = "hapimp-ph810w";
    }   

    @Get
    @Route("/model")
    public async GetModel(): Promise<Response> {
        const name: string = this.name;
        return Response.Json<CameraName>({ name });
    }

    @Get
    @Route("/img/list")
    public async GetImageList(): Promise<Response> {
        const imgsDesc: ImageDesc[] = [];
        
        for (let i: number = 0; i < 5; i++) {
            const name: string = `${randomUUID()}.jpg`;
            const date: string = new Date().toISOString();
            const id: string = randomUUID();
            imgsDesc.push({ name, date, id });
        }

        return Response.Json<ImageDesc[]>(imgsDesc);
    }

    // @Get
    // @Route("/test/")
    // public async Test(): Promise<Response> {
    //     return new Response("<h1>HEY</h1>", MediaType.PLAIN_HTML, Status.OK);
    // }
}