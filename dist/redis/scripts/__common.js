"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.common = void 0;
const response_worker_1 = require("../../core/response-worker");
const util_1 = require("../../core/util");
const app_1 = require("./../../app");
async function objValuesParse(obj) {
    let r = obj;
    // -- all parse
    let result = {};
    for (let k in r) {
        result[k] = await util_1.Util.jsonParse(r[k], true);
    }
    return result;
}
exports.common = {
    async hset(key, data, expire) {
        if (!key)
            throw response_worker_1.ResponseFactory.create('INVALID_TYPE', 'redis key should be defined');
        let args = [];
        for (let k in data) {
            // -- all stringify
            args.push(k);
            let val = await util_1.Util.jsonStringify(data[k]);
            args.push(val);
        }
        let expireArgs = ['expire', key, expire];
        let r = await app_1.App.redis.query([
            ['hset', key, ...args], (expire ? expireArgs : undefined)
        ]);
        return true;
    },
    async hgetall(key, isDeleteAfter = false) {
        let rAll = await app_1.App.redis.query([
            ['hgetall', key],
            (isDeleteAfter ? ['del', key] : null)
        ]);
        let r = rAll[0];
        if (r && typeof r === 'object')
            if (Object.keys(r).length === 0)
                throw response_worker_1.ResponseFactory.create('NOT_FOUND', 'redis key not found');
        let result = await objValuesParse(r);
        return result;
    },
    async delete(key) {
        let r = await app_1.App.redis.queryOne('del', key);
        if (typeof r !== 'number')
            throw response_worker_1.ResponseFactory.create('NOT_FOUND', 'redis key not found');
        if (r > 0)
            return true;
        else
            return false;
    },
};
//# sourceMappingURL=__common.js.map