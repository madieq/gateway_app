import { RedisClient } from "..";
import { ResponseFactory } from "../../core/response-worker";
import User from "../../core/User";
import { Util } from "../../core/util";
import { App } from './../../app'

async function objValuesParse(obj: any) {
    let r = obj
    // -- all parse
    let result = {}
    for (let k in r) {
        result[k] = await Util.jsonParse(r[k], true)
    }
    return result
}
export const common = {
    async hset(key: string, data: { [key: string]: any }, expire?: string | number): Promise<boolean> {
        if (!key)
            throw ResponseFactory.create('INVALID_TYPE', 'redis key should be defined')
        let args = []
        for (let k in data) {
            // -- all stringify
            args.push(k)
            let val = await Util.jsonStringify(data[k])
            args.push(val)
        }
        let expireArgs = ['expire', key, expire]
        let r = await App.redis.query([
            ['hset', key, ...args], (expire ? expireArgs : undefined)
        ])
        return true
    },
    async hgetall(key: string, isDeleteAfter = false): Promise<object> {
        let rAll = await App.redis.query([
            ['hgetall', key],
            (isDeleteAfter ? ['del', key] : null)
        ])
        let r = rAll[0]
        if (r && typeof r === 'object')
            if (Object.keys(r).length === 0)
                throw ResponseFactory.create('NOT_FOUND', 'redis key not found')
        let result = await objValuesParse(r)
        return result
    },
    async delete(key: string): Promise<boolean> {
        let r = await App.redis.queryOne('del', key)
        if (typeof r !== 'number')
            throw ResponseFactory.create('NOT_FOUND', 'redis key not found')
        if (r > 0)
            return true
        else
            return false
    },
}