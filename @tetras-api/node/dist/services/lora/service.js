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
let Lora = class Lora extends dolphin_1.ServiceClass {
    OnStart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger = new dolphin_1.Logger(this.GetName());
            this.registry = new ConfRegistry_1.default({
                lora_gateway: {
                    type: ConfigType_1.Type.String,
                    input: ConfigType_1.Input.Text,
                    display_name: "LoRa Gateway",
                    placeholder: "aa:bb:cc:dd:ee:ff"
                }
            });
            this.registry.SetAll(Conf_1.default.SERVICES[this.GetName()]);
        });
    }
    Ping() {
        return __awaiter(this, void 0, void 0, function* () {
            return dolphin_1.Response.Ok();
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
    Send(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.Info("Receving data");
            console.log(params);
            return dolphin_1.Response.Ok();
        });
    }
};
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/ping")
], Lora.prototype, "Ping", null);
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/configuration")
], Lora.prototype, "GetConfiguration", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/configuration/save"),
    __param(0, (0, dolphin_1.WebMacro)(dolphin_1.SERVICE_MACRO.PARAMS))
], Lora.prototype, "SaveConfiguration", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/send"),
    __param(0, (0, dolphin_1.WebMacro)(dolphin_1.SERVICE_MACRO.PARAMS))
], Lora.prototype, "Send", null);
Lora = __decorate([
    (0, dolphin_1.Service)("lora", "/lora", "localhost", 4002)
], Lora);
exports.default = Lora;
//# sourceMappingURL=service.js.map