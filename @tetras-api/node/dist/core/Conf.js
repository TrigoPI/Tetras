"use strict";
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
const promises_1 = require("fs/promises");
class Conf {
    static get SERVICES() {
        return this.sConfig;
    }
    static Write(name, datas) {
        return __awaiter(this, void 0, void 0, function* () {
            let datasToWrite = {};
            let path = (this.paths[name]) ? this.paths[name] : `${this.path}/${name}.conf.json`;
            let flag = (this.paths[name]) ? "" : "wx";
            for (const key in datas) {
                const desc = datas[key];
                if (desc.value) {
                    datasToWrite[key] = desc.value;
                    this.sConfig[name][key] = desc.value;
                }
            }
            yield (0, promises_1.writeFile)(path, JSON.stringify(datasToWrite), { flag });
        });
    }
    static Load(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield (0, promises_1.readdir)(path);
            this.path = path;
            for (const file of files) {
                const fullPath = `${path}/${file}`;
                if (file.includes(".conf.json")) {
                    const confName = file.split(".")[0];
                    const data = yield (0, promises_1.readFile)(fullPath);
                    this.paths[confName] = fullPath;
                    this.sConfig[confName] = JSON.parse(data.toString());
                }
            }
        });
    }
}
Conf.sConfig = {};
Conf.paths = {};
Conf.path = "";
exports.default = Conf;
//# sourceMappingURL=Conf.js.map