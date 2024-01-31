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
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const dolphin_1 = require("dolphin");
const type_1 = require("./type");
const rest_client_1 = require("rest-client");
const promises_1 = require("fs/promises");
let HapimpPh810w = class HapimpPh810w extends dolphin_1.ServiceClass {
    OnStart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.name = "hapimp-ph810w";
            this.outDir = "../img";
            this.scriptPath = "../script/python/TrailCamLink";
            this.cameraUrl = "http://192.168.1.8";
            this.maxJpg = 16;
        });
    }
    StartScript() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, child_process_1.exec)(`python ${this.scriptPath}/Main.py`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(error);
                        reject();
                        return;
                    }
                    if (stderr)
                        console.log(stderr);
                    console.log(stdout);
                    resolve();
                });
            });
        });
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
    DownloadImage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${this.cameraUrl}/Storage?Download=${id}`, { responseType: "arraybuffer" });
                const buffer = res.data;
                yield (0, promises_1.appendFile)(`${this.outDir}/${id}.jpg`, Buffer.from(buffer));
                return dolphin_1.Response.Ok();
            }
            catch (e) {
                console.log(e);
                return dolphin_1.Response.InternalServerError();
            }
        });
    }
    GetImageList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield rest_client_1.RestClient.Get(`${this.cameraUrl}/SetMode?${type_1.CAMERA_MODE.STORAGE}`);
                const numJpgRes = yield rest_client_1.RestClient.Get(`${this.cameraUrl}/Storage?GetDirFileInfo`);
                const numJpg = numJpgRes.Json()["NumberOfJPG"];
                const pages = Math.floor(numJpg / this.maxJpg);
                const imgs = [];
                for (let i = 0; i < pages; i++) {
                    const pageInfoRes = yield rest_client_1.RestClient.Get(`${this.cameraUrl}/Storage?GetFilePage=${i}`);
                    const pageJson = pageInfoRes.Json();
                    for (const info of pageJson["fs"]) {
                        const name = info["n"];
                        const id = info["fid"];
                        const dt = info["dt"];
                        imgs.push({ name, id, dt });
                    }
                }
                return dolphin_1.Response.Json(imgs);
            }
            catch (e) {
                console.log(e);
                dolphin_1.Response.InternalServerError();
            }
        });
    }
    StartCamera() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Starting camera");
                yield this.StartScript();
                console.log("camera started");
                return dolphin_1.Response.Ok();
            }
            catch (_a) {
                return dolphin_1.Response.InternalServerError();
            }
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
    (0, dolphin_1.Route)("/download/:id"),
    __param(0, (0, dolphin_1.WebString)("id"))
], HapimpPh810w.prototype, "DownloadImage", null);
__decorate([
    dolphin_1.Get,
    (0, dolphin_1.Route)("/img/list")
], HapimpPh810w.prototype, "GetImageList", null);
__decorate([
    dolphin_1.Post,
    (0, dolphin_1.Route)("/start")
], HapimpPh810w.prototype, "StartCamera", null);
HapimpPh810w = __decorate([
    (0, dolphin_1.Service)("hapimp-ph810w", "/camera", "localhost", 4001)
], HapimpPh810w);
exports.default = HapimpPh810w;
//# sourceMappingURL=service.js.map