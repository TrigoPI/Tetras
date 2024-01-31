import { Param, HttpMethod, HttpHandler } from '../Types/http-types';
export default class HttpServer {
    private logger;
    private app;
    private host;
    private port;
    private routers;
    private routesParams;
    private running;
    private server;
    constructor(host: string, port: number);
    IsRunning(): boolean;
    GetIp(): string;
    GetPort(): number;
    Stop(): Promise<void>;
    Listen(): Promise<void>;
    CreateRouter(route: string): void;
    AddSubRoute(route: string, subRoute: string, method: HttpMethod, name: string, handler: HttpHandler): void;
    SetRouteParams(route: string, subRoute: string, method: HttpMethod, params: Param[]): void;
    private IsRequestValid;
    private CastParams;
    private CleanRequest;
    private GenerateFunctionArgs;
    private GenerateMacros;
    private HandleRequest;
}
