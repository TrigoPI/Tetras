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
const ConfRegistry_1 = __importDefault(require("../../core/ConfRegistry"));
const ConfigType_1 = require("../../core/ConfigType");
const Conf_1 = __importDefault(require("../../core/Conf"));
const rest_client_1 = require("rest-client");
let NodeController = class NodeController extends dolphin_1.ServiceClass {
    OnStart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.intervalId = [];
            this.servicesOnline = new Map();
            this.logger = new dolphin_1.Logger(this.GetName());
            this.servicesName = [
                "camera",
                "gateway"
            ];
            this.registry = new ConfRegistry_1.default({
                camera_path: {
                    type: ConfigType_1.Type.String,
                    input: ConfigType_1.Input.Text,
                    display_name: "Camera Path",
                    placeholder: "/camera"
                },
                camera_ip: {
                    type: ConfigType_1.Type.String,
                    input: ConfigType_1.Input.Text,
                    display_name: "Camera IP",
                    placeholder: "localhost"
                },
                camera_port: {
                    type: ConfigType_1.Type.Number,
                    input: ConfigType_1.Input.Text,
                    display_name: "Camera Port",
                    placeholder: "4000"
                },
                gateway_path: {
                    type: ConfigType_1.Type.String,
                    input: ConfigType_1.Input.Text,
                    display_name: "Gateway Path",
                    placeholder: "/gateway"
                },
                gateway_ip: {
                    type: ConfigType_1.Type.String,
                    input: ConfigType_1.Input.Text,
                    display_name: "Gateway IP",
                    placeholder: "localhost"
                },
                gateway_port: {
                    type: ConfigType_1.Type.Number,
                    input: ConfigType_1.Input.Text,
                    display_name: "Gateway Port",
                    placeholder: "4000"
                }
            });
            this.registry.SetAll(Conf_1.default.SERVICES[this.GetName()]);
            this.InitServicesOnline();
            this.PingService("camera", "camera_path", "camera_ip", "camera_port");
            this.PingService("gateway", "gateway_path", "gateway_ip", "gateway_port");
        });
    }
    OnStop() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const id of this.intervalId)
                clearInterval(id);
        });
    }
    InitServicesOnline() {
        for (const name of this.servicesName)
            this.servicesOnline.set(name, false);
    }
    PingService(name, path, ip, port) {
        if (!Conf_1.default.SERVICES[this.GetName()][path])
            return;
        if (!Conf_1.default.SERVICES[this.GetName()][ip])
            return;
        if (!Conf_1.default.SERVICES[this.GetName()][port])
            return;
        const url = `http://${Conf_1.default.SERVICES[this.GetName()][ip]}:${Conf_1.default.SERVICES[this.GetName()][port]}${Conf_1.default.SERVICES[this.GetName()][path]}/ping`;
        let failed = 0;
        const id = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.Print(`Trying to ping ${url}`);
                yield rest_client_1.RestClient.Get(url);
                this.logger.Info(`${url} online`);
                this.servicesOnline.set(name, true);
                yield this.OnServiceOnline(name);
                clearInterval(id);
            }
            catch (_a) {
                failed++;
                this.logger.Warning(`${url} unreachable`);
                if (failed != 5)
                    return;
                this.logger.Error(`Ping ${url}, 5 try failed`);
                this.servicesOnline.set(name, true);
                clearInterval(id);
            }
        }), 3000);
        this.intervalId.push(id);
    }
    OnServiceOnline(name) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const serviceName of this.servicesName) {
                if (!this.servicesOnline.get(serviceName))
                    return;
            }
            yield this.OnAllServicesOnline();
        });
    }
    OnAllServicesOnline() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imgResponse = yield rest_client_1.RestClient.Get(`http://${Conf_1.default.SERVICES[this.GetName()]["camera_ip"]}:${Conf_1.default.SERVICES[this.GetName()]["camera_port"]}${Conf_1.default.SERVICES[this.GetName()]["camera_path"]}/img/list`);
                const date = new Date().toISOString();
                const camera = imgResponse.Json();
                const datas = { camera, date };
                yield rest_client_1.RestClient.Post(`http://${Conf_1.default.SERVICES[this.GetName()]["gateway_ip"]}:${Conf_1.default.SERVICES[this.GetName()]["gateway_port"]}${Conf_1.default.SERVICES[this.GetName()]["gateway_path"]}/send`, datas);
            }
            catch (e) {
                this.logger.Error(e);
            }
        });
    }
    GetConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = this.registry.GetAll();
            return dolphin_1.Response.Json(conf);
        });
    }
    SaveConfiguration(params) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key in params) {
                if (this.registry.KeyExist(key)) {
                    this.registry.Set(key, params[key]);
                }
            }
            yield Conf_1.default.Write(this.GetName(), this.registry.GetAll());
            return dolphin_1.Response.Ok();
        });
    }
};
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/configuration")
], NodeController.prototype, "GetConfiguration", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/configuration/save"),
    __param(0, (0, dolphin_1.WebMacro)(dolphin_1.SERVICE_MACRO.PARAMS))
], NodeController.prototype, "SaveConfiguration", null);
NodeController = __decorate([
    (0, dolphin_1.Service)("node-controller", "/node-controller", "localhost", 4000)
], NodeController);
exports.default = NodeController;
//# sourceMappingURL=service.js.map