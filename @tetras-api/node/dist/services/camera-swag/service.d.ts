import { Response, ServiceClass } from "dolphin";
export default class CameraSwag extends ServiceClass {
    Ping(): Promise<Response>;
    GetModel(): Promise<Response>;
    DownloadImage(id: string): Promise<Response>;
    GetImageList(): Promise<Response>;
    StartCamera(): Promise<Response>;
}
