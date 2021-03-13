"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
class Config {
    constructor() {
        this.HTTP_PORT = '11000';
        this.SOCKET_PORT = '11001';
        this.CORS = 't';
        this.DEV = 't';
        this.REDIS_PREFIX = `local:redis:`;
        this.REDIS_URI = `192.168.1.11:6379;`;
        this.TOKEN_EXPIRE_SEC = `600`;
    }
}
exports.config = new Config;
//# sourceMappingURL=config.js.map