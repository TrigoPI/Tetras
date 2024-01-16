"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfRegistery {
    constructor() {
        this.conf = {};
    }
    Register(conf) {
        this.conf = Object.assign({}, conf);
    }
    Get(name) {
        const type = this.conf[name];
        if (!type)
            throw new Error(`${name} not found`);
        return type;
    }
    GetAll() {
        return this.conf;
    }
}
exports.default = ConfRegistery;
//# sourceMappingURL=ConfRegister.js.map