"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CoreObject {
    constructor() {
        this.$$type = 'CoreObject';
    }
    assign(obj) {
        if (obj && typeof obj === 'object') {
            let self = this;
            Object.keys(obj).forEach(k => { self[k] = obj[k]; });
        }
        return this;
    }
    stringify() {
        let self = this;
        return JSON.stringify(self);
    }
}
exports.default = CoreObject;
//# sourceMappingURL=CoreObject.js.map