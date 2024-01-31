import axios, { AxiosResponse } from "axios";

import { ExecException, exec } from "child_process";

import { Get, Post, Response, Route, Service, ServiceClass, WebString } from "dolphin";
import { CAMERA_MODE, CameraName, ImageDesc } from "./type";
import { HttpResponse, RestClient } from "rest-client";
import { appendFile } from "fs/promises";

@Service("hapimp-ph810w", "/camera", "localhost", 4001)
export default class HapimpPh810w extends ServiceClass {
    private name: string;
    private scriptPath: string;
    private cameraUrl: string;
    private outDir: string;
    private maxJpg: number;

    public override async OnStart(): Promise<void> {
        this.name = "hapimp-ph810w";
        this.outDir = "../img"
        this.scriptPath = "../script/python/TrailCamLink";
        this.cameraUrl = "http://192.168.1.8";
        this.maxJpg = 16;
    }

    private async StartScript(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            exec(`python ${this.scriptPath}/Main.py`, (error: ExecException, stdout: string, stderr: string) => {
                if (error) {
                    console.log(error);
                    reject();
                    return;
                }

                if (stderr) console.log(stderr);
                console.log(stdout);
                resolve();
            });
        });
    }

    @Get
    @Route("/ping")
    public async Ping(): Promise<Response> {
        return Response.Ok();
    }

    @Get
    @Route("/model")
    public async GetModel(): Promise<Response> {
        const name: string = this.name;
        return Response.Json<CameraName>({ name });
    }

    @Get
    @Route("/download/:id")
    public async DownloadImage(
        @WebString("id") id: string
    ): Promise<Response> {
        try {
            const res: AxiosResponse = await axios.get(`${this.cameraUrl}/Storage?Download=${id}`, { responseType: "arraybuffer" });
            const buffer: ArrayBuffer = res.data;

            await appendFile(`${this.outDir}/${id}.jpg`, Buffer.from(buffer));

            return Response.Ok();
        } catch (e: any) {
            console.log(e);
            return Response.InternalServerError();
        }
    }

    @Get
    @Route("/img/list")
    public async GetImageList(): Promise<Response> {
        try {
            await RestClient.Get(`${this.cameraUrl}/SetMode?${CAMERA_MODE.STORAGE}`);
            
            const numJpgRes: HttpResponse = await RestClient.Get(`${this.cameraUrl}/Storage?GetDirFileInfo`);
            const numJpg: number = numJpgRes.Json()["NumberOfJPG"];
            const pages: number = Math.floor(numJpg / this.maxJpg);
            const imgs: ImageDesc[] = [];

            for (let i: number = 0; i < pages; i++) {
                const pageInfoRes: HttpResponse = await RestClient.Get(`${this.cameraUrl}/Storage?GetFilePage=${i}`);
                const pageJson = pageInfoRes.Json();
                
                for (const info of pageJson["fs"]) {
                    const name: string = info["n"];
                    const id: string = info["fid"];
                    const dt: number = info["dt"];

                    imgs.push({ name, id, dt });
                }
            }

            return Response.Json<ImageDesc[]>(imgs);
        } catch (e: any) {
            console.log(e);
            Response.InternalServerError();
        }
    }

    @Post
    @Route("/start")
    public async StartCamera(): Promise<Response> {
        try {
            console.log("Starting camera");
            await this.StartScript();
            console.log("camera started");
            
            return Response.Ok();
        } catch {
            return Response.InternalServerError();
        }
    }
}