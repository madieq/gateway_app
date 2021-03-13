import { Logger } from "../core/log";
import * as IORedis from 'ioredis'
import { Redis } from 'ioredis'
import { ResponseFactory } from "../core/response-worker";
import { Util } from '../core/util'
import * as fse from 'fs-extra'
import * as path from 'path'

export class RedisClient {
    redisPrefix = process.env.REDIS_PREFIX || ''
    redisUri = process.env.REDIS_URI || ''
    static LOG_PREFIX = `[REDIS]`
    client: Redis
    async connect() {
        Logger.info(`${RedisClient.LOG_PREFIX} connecting ${this.redisUri}...`)
        let redisUriOne = this.redisUri.split(';').filter(i => i).pop()
        this.client = new IORedis.default(redisUriOne,
            {
                keyPrefix: this.redisPrefix,
                lazyConnect: true,
                retryStrategy(times) {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                }
            })
        await this.client.connect()
        // -- load lua
        let scriptsDir = path.resolve(process.cwd(), 'source', 'redis', 'scripts')
        await fse.ensureDir(scriptsDir)
        let filesScripts = (await fse.readdir(scriptsDir))
            .filter(n => /_[_a-zA-Z0-9]+\.[0-9]+\.lua$/.test(n))
            .map(n => ({ name: n.split('.')[0], numberOfKeys: parseInt(n.split('.')[1]), full: n, }))

        for (let l of filesScripts) {
            let scr = (await fse.readFile(path.join(scriptsDir, l.full))).toString()
            this.client.defineCommand(l.name, { numberOfKeys: l.numberOfKeys, lua: scr })
        }
        let t = await this.lua('_hgetall', 'users:admin')
        Logger.info(`${RedisClient.LOG_PREFIX} connected`)
        return this
    }
    async query(commands: Array<Array<string>> = []) {
        let r = await this.client.multi(commands.filter(i => i)).exec()
        let errors = r.filter(arrCbRes => arrCbRes[0] !== null)
        if (errors.length > 0)
            throw ResponseFactory.create('ERROR', `${RedisClient.LOG_PREFIX} ${Util.jsonStringify(errors)}`)
        r = r.map(arrCbRes => arrCbRes[1])
        return r
    }
    async queryOne(commandName: string, ...args: string[]) {
        let r = await this.client[commandName](...args)
        return r
    }
    async duplicate() {
        return this.client.duplicate()
    }
    async lua(luaScriptName: string, ...args: string[]) {
        try {
            let r = await this.client[luaScriptName](...args)
            r = await Util.jsonParse(r)
            if (r && !Array.isArray(r) && typeof r === 'object')
                if (r.$$type) {
                    let objCore = (require('../core/' + r.$$type) || {}).default
                    if (objCore)
                        r = new objCore().assign(r)
                }
            return r
        } catch (error) {
            throw ResponseFactory.create('ERROR', error.message)
        }
    }
}