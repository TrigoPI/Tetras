export default class Config {
    private static sConfig;
    static get API_CORE(): Record<string, any>;
    static Load(path: string): void;
}
