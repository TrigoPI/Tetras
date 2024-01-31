export default class HttpResponse {
    private body;
    constructor(body: string);
    Text(): string;
    Json<T>(): T;
}
