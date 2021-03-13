import cryptoRandomString from 'crypto-random-string'
import { ResponseFactory } from './response-worker'

export class Util {
    static async sleep(ms = 1) {
        return new Promise((res, rej) => {
            setTimeout(() => { res(true) }, ms)
        })
    }
    static async randomstring(length = 64) {
        return (await cryptoRandomString.async({ length: length }))
    }
    static async jsonStringify(d: any) {
        let r = ''
        if (!d)
            return ''
        r = JSON.stringify(d)
        return r
    }
    static async jsonParse(d?: string, isSkipErrors = false) {
        let r: Array<any> | Object
        if (!d)
            return undefined
        try {
            r = JSON.parse(d)
        } catch (error) {
            if (isSkipErrors)
                return d
            else
                throw ResponseFactory.create('INVALID_JSON', (error.message || '').toString() || error.toString())
        }
        return r
    }
}