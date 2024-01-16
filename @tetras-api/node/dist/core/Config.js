"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Config {
    static get API_CORE() {
        if (!this.sConfig)
            throw new Error("Configuration not loaded");
        return this.sConfig;
    }
    static Load(path) {
        const data = (0, fs_1.readFileSync)(path, "utf-8");
        this.sConfig = JSON.parse(data);
    }
}
Config.sConfig = undefined;
exports.default = Config;
//# sourceMappingURL=Config.js.map