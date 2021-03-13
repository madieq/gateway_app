"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const log_1 = require("../core/log");
const IORedis = __importStar(require("ioredis"));
const response_worker_1 = require("../core/response-worker");
const util_1 = require("../core/util");
const fse = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class RedisClient {
    constructor() {
        this.redisPrefix = process.env.REDIS_PREFIX || '';
        this.redisUri = process.env.REDIS_URI || '';
    }
    async connect() {
        log_1.Logger.info(`${RedisClient.LOG_PREFIX} connecting ${this.redisUri}...`);
        let redisUriOne = this.redisUri.split(';').filter(i => i).pop();
        this.client = new IORedis.default(redisUriOne, {
            keyPrefix: this.redisPrefix,
            lazyConnect: true,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });
        await this.client.connect();
        // -- load lua
        let scriptsDir = path.resolve(process.cwd(), 'source', 'redis', 'scripts');
        await fse.ensureDir(scriptsDir);
        let filesScripts = (await fse.readdir(scriptsDir))
            .filter(n => /_[_a-zA-Z0-9]+\.[0-9]+\.lua$/.test(n))
            .map(n => ({ name: n.split('.')[0], numberOfKeys: parseInt(n.split('.')[1]), full: n, }));
        for (let l of filesScripts) {
            let scr = (await fse.readFile(path.join(scriptsDir, l.full))).toString();
            this.client.defineCommand(l.name, { numberOfKeys: l.numberOfKeys, lua: scr });
        }
        let t = await this.lua('_hgetall', 'users:admin');
        log_1.Logger.info(`${RedisClient.LOG_PREFIX} connected`);
        return this;
    }
    async query(commands = []) {
        let r = await this.client.multi(commands.filter(i => i)).exec();
        let errors = r.filter(arrCbRes => arrCbRes[0] !== null);
        if (errors.length > 0)
            throw response_worker_1.ResponseFactory.create('ERROR', `${RedisClient.LOG_PREFIX} ${util_1.Util.jsonStringify(errors)}`);
        r = r.map(arrCbRes => arrCbRes[1]);
        return r;
    }
    async queryOne(commandName, ...args) {
        let r = await this.client[commandName](...args);
        return r;
    }
    async duplicate() {
        return this.client.duplicate();
    }
    async lua(luaScriptName, ...args) {
        try {
            let r = await this.client[luaScriptName](...args);
            r = await util_1.Util.jsonParse(r);
            if (r && !Array.isArray(r) && typeof r === 'object')
                if (r.$$type) {
                    let objCore = (require('../core/' + r.$$type) || {}).default;
                    if (objCore)
                        r = new objCore().assign(r);
                }
            return r;
        }
        catch (error) {
            throw response_worker_1.ResponseFactory.create('ERROR', error.message);
        }
    }
}
exports.RedisClient = RedisClient;
RedisClient.LOG_PREFIX = `[REDIS]`;
//# sourceMappingURL=index.js.map