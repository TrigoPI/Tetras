import HttpResponse from "./HttpResponse";
export default class RestClient {
    private constructor();
    static Get(url: string): Promise<HttpResponse>;
    static Post(url: string, datas?: Record<string, any> | undefined): Promise<HttpResponse>;
}
