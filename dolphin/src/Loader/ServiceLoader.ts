import Directory from "../lib/File/Directory";
import DirectoryData from "../lib/File/DirectoryData";
import { FileSystem } from "../lib/File/FileSystem";
import Logger from "../lib/Log/Logger";
import { Param } from "../types/http-types";
import { ServiceData } from "../types/service-module-types";
import HttpClass from "../Manager/HttpClass";
import HttpClassManager from "../Manager/HttpClassManager";
import HttpFunction from "../Manager/HttpFunction";
import ServiceClass from "../Service/ServiceClass";

type Class = { new(): ServiceClass };

export default class ServiceLoader {
    private logger: Logger;
    private dirPath: string;

    public constructor(dirPath: string) {
        this.logger = new Logger(ServiceLoader.name);
        this.dirPath = dirPath;
    }

    public async Load(): Promise<ServiceData[]> {
        this.logger.Print("Loading services");
        const services: ServiceData[] = [];
        const directorys: Directory = await FileSystem.ReadDir(this.dirPath);
        for (const dir of directorys.GetContent()) {
            try { 
                services.push(await this.LoadModule(dir)); 
            } 
            catch (err: any) { 
                this.logger.Warning(`Cannot load module ${dir.path}`) 
                this.logger.Error((<Error>err).stack);
            }
        };

        return services;
    }

    private async LoadModule(dir: DirectoryData): Promise<ServiceData> {
        const manager: HttpClassManager = HttpClassManager.GetInstance();
        const path: string = `${this.dirPath}/${dir.name}/service`;
        const module: Class | undefined = (await import(path)).default;

        if (!module) throw new Error(`Module ${path} doesn't have default export`)
        const service: ServiceClass = new module();
        if (!(service instanceof ServiceClass)) throw new Error(`Module ${path} is not instance of ServiceClass`);
        
        const className: string = Object.getPrototypeOf(service.constructor).name;
        
        this.logger.Info(`Service(${path}) loaded`);
        this.logger.Print(`  |--> Name : ${service.GetName()}`);
        this.logger.Print(`      |--> Base path : ${service.GetRoute()}`);
        this.logger.Print(`      |--> Ip : ${service.GetIp()}`);
        this.logger.Print(`      |--> Port : ${service.GetPort()}`);
        this.logger.Print(`      |--> Class : ${className}`);

        if (!manager.ClassExist(className)) return { className: className, service: service, functions: [] }
        const httpClass: HttpClass = manager.GetClass(className);
        const httpFunctions: HttpFunction[] = httpClass.GetFunctions();
        const functions: HttpFunction[] = [];
        
        httpFunctions.forEach((func: HttpFunction) => {
            if (!func.HasRoute()) {
                this.logger.Print(`         |--> function : ${func.GetName()}`);
                this.logger.Error(`         |--> Error`);
                this.logger.Error(`             |--> route : undefined`);
                return;
            }

            if (!func.HasMethod()) {
                this.logger.Print(`         |--> function : ${func.GetName()}`);
                this.logger.Error(`         |--> Error`);
                this.logger.Error(`             |--> method : undefined`);
                return;
            }

            const params: Param[] = func.GetParams();

            this.logger.Print(`         |--> function : ${func.GetName()}`);
            this.logger.Print(`             |--> route : ${func.GetRoute()}`);
            this.logger.Print(`             |--> method : ${func.GetMethod()}`);
            this.logger.Print(`             |--> params`);

            params.forEach((param: Param) => {
                this.logger.Print(`                 |--> param`);
                this.logger.Print(`                     |--> name : ${param.name}`);
                this.logger.Print(`                     |--> type : ${param.type}`);
                this.logger.Print(`                     |--> index ${param.index}`);
            })

            functions.push(func);
        });
        
        return { className, functions, service };
    }
}