"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
const dolphin_1 = require("dolphin");
const crypto_1 = require("crypto");
let HapimpPh810w = class HapimpPh810w extends dolphin_1.ServiceClass {
    constructor() {
        super();
        this.name = "hapimp-ph810w";
    }
    Ping() {
        return __awaiter(this, void 0, void 0, function* () {
            return dolphin_1.Response.Ok();
        });
    }
    GetModel() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = this.name;
            return dolphin_1.Response.Json({ name });
        });
    }
    GetImageList() {
        return __awaiter(this, void 0, void 0, function* () {
            const imgsDesc = [];
            for (let i = 0; i < 10; i++) {
                const name = `${(0, crypto_1.randomUUID)()}.jpg`;
                const date = new Date().toISOString();
                const id = (0, crypto_1.randomUUID)();
                imgsDesc.push({ name, date, id });
            }
            return dolphin_1.Response.Json(imgsDesc);
        });
    }
};
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/ping")
], HapimpPh810w.prototype, "Ping", null);
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/model")
], HapimpPh810w.prototype, "GetModel", null);
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/img/list")
], HapimpPh810w.prototype, "GetImageList", null);
HapimpPh810w = __decorate([
    (0, dolphin_1.Service)("hapimp-ph810w", "/camera", "localhost", 4001)
], HapimpPh810w);
exports.default = HapimpPh810w;
//# sourceMappingURL=service.js.map