"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.ResponseFactory = void 0;
let preset = {
    ERROR: { ok: false, status: 500 },
    OK: { ok: true, status: 200 },
    NOT_FOUND: { ok: false, status: 404 },
    AUTHORIZE: { ok: false, status: 403 },
    AUTH_OF_ACTION: { ok: false, status: 401 },
    INVALID_JSON: { ok: false, status: 400 },
    INVALID_TYPE: { ok: false, status: 400 },
};
class ResponseFactory {
    static create(presetName, messageOrData = '') {
        let r;
        if (preset[presetName])
            if (typeof messageOrData === 'string')
                r = new Response(presetName, messageOrData, undefined, preset[presetName].status || 500, !!preset[presetName].ok);
            else {
                r = new Response(presetName, '', messageOrData || {}, preset[presetName].status || 500, !!preset[presetName].ok);
            }
        return r;
    }
}
exports.ResponseFactory = ResponseFactory;
class Response {
    constructor(code = '', message = '', data = {}, status = 500, ok = false) {
        this.ok = false;
        this.status = 500;
        this.code = 'ERROR';
        this.message = '';
        this.stack = '';
        this.data = {};
        this.code = code;
        this.message = message;
        this.data = data;
        this.status = status;
        this.ok = ok;
    }
}
exports.Response = Response;
//# sourceMappingURL=response-worker.js.map