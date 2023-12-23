import { EntryPoint, ServiceLuncher } from "dolphin";
import path from "path";

import Conf from "./core/Conf";

@EntryPoint(path.resolve(".", "services"))
export default class Main {
    public async Start(): Promise<void> {
        const confPath: string = path.resolve("..", "conf");
        const luncher: ServiceLuncher = ServiceLuncher.GetInstance();

        await Conf.Load(`${confPath}`);
        
        await luncher.LoadServices();
        await luncher.StartService("api-core");
    }

    public static async CreateApplication(): Promise<void> {
        const app: Main = new Main();
        await app.Start();
    }
}