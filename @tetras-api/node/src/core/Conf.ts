import { readFile, readdir, writeFile } from "fs/promises";
import { ConfDesc } from "./ConfigType";

export default class Conf {
    private static sConfig: Record<string, any> = {};
    private static paths: Record<string, any> = {};
    private static path: string = "";

    public static get SERVICES(): Record<string, any> {
        return this.sConfig
    }

    public static async Write(name: string, datas: Record<string, ConfDesc>): Promise<void> {
        let datasToWrite: Record<string, any> = {};
        let path: string = (this.paths[name])? this.paths[name] : `${this.path}/${name}.conf.json`;
        let flag: string = (this.paths[name])? "" : "wx" 

        for (const key in datas) {
            const desc: ConfDesc = datas[key];
            if (desc.value) {
                datasToWrite[key] = desc.value;
                this.sConfig[name][key] = desc.value;
            }
        }
        
        await writeFile(path, JSON.stringify(datasToWrite), { flag });
    }

    public static async Load(path: string): Promise<void> {
        const files: string[] = await readdir(path);
        this.path = path;
        
        for (const file of files) {
            const fullPath: string = `${path}/${file}`;

            if (file.includes(".conf.json")) {
                const confName: string = file.split(".")[0];
                const data: Buffer = await readFile(fullPath);
                this.paths[confName] = fullPath; 
                this.sConfig[confName] = JSON.parse(data.toString());
            }
        }
    }
}