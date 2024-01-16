"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dolphin_1 = require("dolphin");
const rest_client_1 = require("rest-client");
const ConfigType_1 = require("../../core/ConfigType");
const Conf_1 = __importDefault(require("../../core/Conf"));
const ConfRegistry_1 = __importDefault(require("../../core/ConfRegistry"));
let ApiCore = class ApiCore extends dolphin_1.ServiceClass {
    OnStart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.luncher = dolphin_1.ServiceLuncher.GetInstance();
            this.logger = new dolphin_1.Logger(this.GetName());
            this.registry = new ConfRegistry_1.default({
                port: {
                    type: ConfigType_1.Type.Number,
                    input: ConfigType_1.Input.Text,
                    display_name: "Port",
                    placeholder: "8080"
                },
                ip: {
                    type: ConfigType_1.Type.String,
                    input: ConfigType_1.Input.Text,
                    display_name: "IP",
                    placeholder: "localhost"
                },
                auto_start: {
                    type: ConfigType_1.Type.String,
                    input: ConfigType_1.Input.Checkbox,
                    display_name: "Auto Start",
                    placeholder: "",
                    checkboxes: this.luncher.GetServiceNames().filter((value) => value != this.GetName())
                }
            });
            this.registry.SetAll(Conf_1.default.SERVICES[this.GetName()]);
            yield this.StartSubServices();
        });
    }
    StartSubServices() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Conf_1.default.SERVICES["api-core"]["auto_start"])
                return;
            for (let name of Conf_1.default.SERVICES["api-core"]["auto_start"]) {
                if (this.luncher.ServiceExist(name)) {
                    try {
                        yield this.luncher.StartService(name);
                    }
                    catch (e) {
                        this.logger.Error(e);
                    }
                }
                else {
                    this.logger.Error(`Cannot find service ${name}`);
                }
            }
        });
    }
    GetServicesDesc() {
        return __awaiter(this, void 0, void 0, function* () {
            const desc = this.luncher.GetServicesDesc();
            return dolphin_1.Response.Json(desc);
        });
    }
    GetServiceConfiguration(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.luncher.ServiceExist(name))
                return dolphin_1.Response.NotFound();
            if (!this.luncher.IsRunning(name))
                return dolphin_1.Response.NotFound();
            if (name == this.GetName()) {
                const confDesc = this.registry.GetAll();
                return dolphin_1.Response.Json(confDesc);
            }
            try {
                const service = this.luncher.GetService(name);
                const res = yield rest_client_1.RestClient.Get(`http://${service.ip}:${service.port}${service.base_path}/configuration`);
                const json = res.Json();
                return dolphin_1.Response.Json(json);
            }
            catch (e) {
                return dolphin_1.Response.NotFound();
            }
        });
    }
    SaveServiceConfiguration(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.luncher.ServiceExist(name))
                return dolphin_1.Response.NotFound();
            if (!this.luncher.IsRunning(name))
                return dolphin_1.Response.NotFound();
            if (name == this.GetName()) {
                for (const key in params) {
                    if (this.registry.KeyExist(key)) {
                        this.registry.Set(key, params[key]);
                    }
                }
                yield Conf_1.default.Write(this.GetName(), this.registry.GetAll());
                return dolphin_1.Response.Ok();
            }
            try {
                const service = this.luncher.GetService(name);
                yield rest_client_1.RestClient.Post(`http://${service.ip}:${service.port}${service.base_path}/configuration/save`, params);
                return dolphin_1.Response.Ok();
            }
            catch (e) {
                return dolphin_1.Response.NotFound();
            }
        });
    }
    StartService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.luncher.ServiceExist(name))
                return dolphin_1.Response.NotFound();
            if (this.luncher.IsRunning(name))
                return dolphin_1.Response.Conflict();
            yield this.luncher.StartService(name);
            return dolphin_1.Response.Ok();
        });
    }
    StopService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name == this.GetName())
                return dolphin_1.Response.Unauthorized();
            if (!this.luncher.ServiceExist(name))
                return dolphin_1.Response.NotFound();
            if (!this.luncher.IsRunning(name))
                return dolphin_1.Response.Conflict();
            yield this.luncher.StopService(name);
            return dolphin_1.Response.Ok();
        });
    }
    ReloadService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name == this.GetName())
                return dolphin_1.Response.Unauthorized();
            if (!this.luncher.ServiceExist(name))
                return dolphin_1.Response.NotFound();
            yield this.luncher.ReloadService(name);
            return dolphin_1.Response.Ok();
        });
    }
};
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/service/names")
], ApiCore.prototype, "GetServicesDesc", null);
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/service/configuration/:name"),
    __param(0, (0, dolphin_1.WebString)("name"))
], ApiCore.prototype, "GetServiceConfiguration", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/service/configuration/save/:name"),
    __param(0, (0, dolphin_1.WebString)("name")),
    __param(1, (0, dolphin_1.WebMacro)(dolphin_1.SERVICE_MACRO.PARAMS))
], ApiCore.prototype, "SaveServiceConfiguration", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/service/start/:name"),
    __param(0, (0, dolphin_1.WebString)("name"))
], ApiCore.prototype, "StartService", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/service/stop/:name"),
    __param(0, (0, dolphin_1.WebString)("name"))
], ApiCore.prototype, "StopService", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/service/reload/:name"),
    __param(0, (0, dolphin_1.WebString)("name"))
], ApiCore.prototype, "ReloadService", null);
ApiCore = __decorate([
    (0, dolphin_1.Service)("api-core", "/api-core", Conf_1.default.SERVICES["api-core"]["ip"], Conf_1.default.SERVICES["api-core"]["port"])
], ApiCore);
exports.default = ApiCore;
//# sourceMappingURL=service.js.map