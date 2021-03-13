import { App } from "../../app"
import { ResponseFactory } from "../../core/response-worker"
import User from "../../core/User"
import { Util } from "../../core/util"
import { common } from "./__common"
import { TicketStorage, TokenStorage } from "./__interface"

export const auth = {
    async saveUserContext(user: User) {
        let r = await common.hset(`users:${user.name}`, user)
        return true
    },
    async registerUser(emailHash: string, hashOfCredentials: string, user: User) {
        let luaRes = await App.redis.lua('_register_user',
            `user_emails:${emailHash}`, `user_credentials:${hashOfCredentials}`, `users:${user.name}`,
            user.stringify())
        return luaRes
    },
    async getUserByLoginPass(login = '', hashed_pass = '') {
        let tObj: any
        try {
            tObj = await common.hgetall(`user_credentials:${login}_${hashed_pass}`)
        } catch (error) {
            throw ResponseFactory.create('AUTHORIZE', 'invalid login or password')
        }
        let u = await common.hgetall(`users:${tObj.user}`)
        let user = new User().assign(u)
        return user
    },
    async getUserContext(userName: string): Promise<User> {
        let user = await App.redis.lua('_hgetall', 'users:' + userName)
        return user
    },
    async getUserByTicket(t: string) {
        let tObj: any = await common.hgetall(`tickets:${t}`, true)
        let u = await common.hgetall(`users:${tObj.user}`)
        let user = new User().assign(u)
        return user
    },
    async createTokenForUser(user: User) {
        // -- create
        let token = await Util.randomstring(64)
        let refresh_token = await Util.randomstring(20)
        let expire_sec = process.env.TOKEN_EXPIRE_SEC
        let expire_in = Date.now() + (((process.env.TOKEN_EXPIRE_SEC || 600) as number) * 1000) + ''
        let tokenObject: TokenStorage = { user: user.name, token, expire_sec, expire_in, refresh_token }
        // -- save
        let redisResult = await common.hset(`tokens:${token}`, tokenObject, expire_sec)
        return tokenObject
    },
    async getUserByToken(token: string): Promise<User> {
        let tObj: any = await common.hgetall(`tokens:${token}`)
        let u = await common.hgetall(`users:${tObj.user}`)
        let user = new User().assign(u)
        return user
    },
    async removeToken(token: string) {
        let r = await common.delete(`tokens:${token}`)
        return r
    },
    async createTicketForUser(user: User) {
        // -- create
        let t = await Util.randomstring(20)
        let expire_sec = 60
        let tObject: TicketStorage = { user: user.name, ticket: t }
        // -- save
        let redisResult = await common.hset(`tickets:${t}`, tObject, expire_sec)
        return tObject
    },

}