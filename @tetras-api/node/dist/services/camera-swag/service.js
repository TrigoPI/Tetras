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
Object.defineProperty(exports, "__esModule", { value: true });
const dolphin_1 = require("dolphin");
let CameraSwag = class CameraSwag extends dolphin_1.ServiceClass {
    Ping() {
        return __awaiter(this, void 0, void 0, function* () {
            return dolphin_1.Response.Ok();
        });
    }
    GetModel() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = "camera-swag";
            return dolphin_1.Response.Json({ name });
        });
    }
    DownloadImage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return dolphin_1.Response.Ok();
        });
    }
    GetImageList() {
        return __awaiter(this, void 0, void 0, function* () {
            const imgs = [];
            for (let i = 0; i < 10; i++) {
                const name = "SC >> SI";
                const dt = i;
                const id = "01010011 01000011 00100000 00111110 00111110 00100000 01010011 01000011";
                imgs.push({ name, dt, id });
            }
            return dolphin_1.Response.Json(imgs);
        });
    }
    StartCamera() {
        return __awaiter(this, void 0, void 0, function* () {
            return dolphin_1.Response.Ok();
        });
    }
};
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/ping")
], CameraSwag.prototype, "Ping", null);
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/model")
], CameraSwag.prototype, "GetModel", null);
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/download/:id"),
    __param(0, (0, dolphin_1.WebString)("id"))
], CameraSwag.prototype, "DownloadImage", null);
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/img/list")
], CameraSwag.prototype, "GetImageList", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/start")
], CameraSwag.prototype, "StartCamera", null);
CameraSwag = __decorate([
    (0, dolphin_1.Service)("camera-swag", "/camera-swag", "localhost", 4003)
], CameraSwag);
exports.default = CameraSwag;
//# sourceMappingURL=service.js.map