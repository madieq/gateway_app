"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const response_worker_1 = require("./response-worker");
class Util {
    static async sleep(ms = 1) {
        return new Promise((res, rej) => {
            setTimeout(() => { res(true); }, ms);
        });
    }
    static async randomstring(length = 64) {
        return (await crypto_random_string_1.default.async({ length: length }));
    }
    static async jsonStringify(d) {
        let r = '';
        if (!d)
            return '';
        r = JSON.stringify(d);
        return r;
    }
    static async jsonParse(d, isSkipErrors = false) {
        let r;
        if (!d)
            return undefined;
        try {
            r = JSON.parse(d);
        }
        catch (error) {
            if (isSkipErrors)
                return d;
            else
                throw response_worker_1.ResponseFactory.create('INVALID_JSON', (error.message || '').toString() || error.toString());
        }
        return r;
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map