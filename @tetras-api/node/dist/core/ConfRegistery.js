"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfRegistery {
    constructor(conf) {
        this.conf = conf;
    }
    KeyExist(name) {
        return this.conf[name] != undefined;
    }
    Get(name) {
        const desc = this.conf[name];
        if (!desc)
            throw new Error(`${name} not found`);
        return desc;
    }
    GetAll() {
        return this.conf;
    }
    SetAll(conf) {
        for (const key in conf)
            this.Set(key, conf[key]);
    }
    Set(name, value) {
        const desc = this.conf[name];
        if (!desc)
            throw new Error(`${name} not found`);
        this.conf[name].value = value;
    }
}
exports.default = ConfRegistery;
//# sourceMappingURL=ConfRegistery.js.map