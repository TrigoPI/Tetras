import { ConfDesc } from "./ConfigType";
export default class Conf {
    private static sConfig;
    private static paths;
    private static path;
    static get SERVICES(): Record<string, any>;
    static Write(name: string, datas: Record<string, ConfDesc>): Promise<void>;
    static Load(path: string): Promise<void>;
}
