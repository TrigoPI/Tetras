import { Response, ServiceClass } from "dolphin";
export default class HapimpPh810w extends ServiceClass {
    private name;
    private scriptPath;
    private cameraUrl;
    private outDir;
    private maxJpg;
    OnStart(): Promise<void>;
    private StartScript;
    Ping(): Promise<Response>;
    GetModel(): Promise<Response>;
    DownloadImage(id: string): Promise<Response>;
    GetImageList(): Promise<Response>;
    StartCamera(): Promise<Response>;
}
