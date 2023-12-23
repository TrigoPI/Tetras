import { readFile, readdir, writeFile } from "fs/promises";
import { ConfDesc } from "./ConfigType";

export default class Conf {
    private static sConfig: Record<string, any> = {};
    private static paths: Record<string, any> = {};

    public static get SERVICES(): Record<string, any> {
        return this.sConfig
    }

    public static async Write(name: string, datas: Record<string, ConfDesc>): Promise<void> {
        if (!this.sConfig[name]) throw new Error(`Cannot find configuration for ${name}`);
        let datasToWrite: Record<string, any> = {};
        for (const key in datas) {
            const desc: ConfDesc = datas[key];
            if (desc.value) datasToWrite[key] = desc.value;
        }
        await writeFile(this.paths[name], JSON.stringify(datasToWrite));
    }

    public static async Load(path: string): Promise<void> {
        const files: string[] = await readdir(path);
        
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