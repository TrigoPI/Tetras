import path from "path";
import { EntryPoint, ServiceLuncher } from "dolphin";

@EntryPoint(path.resolve(".", "services"))
export default class Main {
    public async Start(): Promise<void> {
        const luncher: ServiceLuncher = ServiceLuncher.GetInstance();
        await luncher.LoadServices();
        await luncher.StartService("controller");
    }

    public static async CreateApplication(): Promise<void> {
        const app: Main = new Main();
        await app.Start();
    }
}