"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const app_1 = require("../../app");
const User_1 = __importDefault(require("../../core/User"));
const util_1 = require("../../core/util");
const __common_1 = require("./__common");
exports.auth = {
    async saveUserContext(user) {
        let r = await __common_1.common.hset(`users:${user.name}`, user);
        return true;
    },
    async registerUser(emailHash, hashOfCredentials, user) {
        let luaRes = await app_1.App.redis.lua('_register_user', `user_emails:${emailHash}`, `user_credentials:${hashOfCredentials}`, `users:${user.name}`, user.stringify());
        return luaRes;
    },
    async getUserByLoginPass(login = '', hashed_pass = '') {
        // let tObj: any
        // try {
        //     tObj = await common.hgetall(`user_credentials:${login}_${hashed_pass}`)
        // } catch (error) {
        //     throw ResponseFactory.create('AUTHORIZE', 'invalid login or password')
        // }
        // let u = await common.hgetall(`users:${tObj.user}`)
        // let user = new User().assign(u)
        // return user
    },
    async getUserContext(userName) {
        let user = await app_1.App.redis.lua('_hgetall', 'users:' + userName);
        return user;
    },
    async getUserByTicket(t) {
        let tObj = await __common_1.common.hgetall(`tickets:${t}`, true);
        let u = await __common_1.common.hgetall(`users:${tObj.user}`);
        let user = new User_1.default().assign(u);
        return user;
    },
    async createTokenForUser(user) {
        // -- create
        let token = await util_1.Util.randomstring(64);
        let refresh_token = await util_1.Util.randomstring(20);
        let expire_sec = process.env.TOKEN_EXPIRE_SEC;
        let expire_in = Date.now() + ((process.env.TOKEN_EXPIRE_SEC || 600) * 1000) + '';
        let tokenObject = { user: user.name, token, expire_sec, expire_in, refresh_token };
        // -- save
        let redisResult = await __common_1.common.hset(`tokens:${token}`, tokenObject, expire_sec);
        return tokenObject;
    },
    async getUserByToken(token) {
        let tObj = await __common_1.common.hgetall(`tokens:${token}`);
        let u = await __common_1.common.hgetall(`users:${tObj.user}`);
        let user = new User_1.default().assign(u);
        return user;
    },
    async removeToken(token) {
        let r = await __common_1.common.delete(`tokens:${token}`);
        return r;
    },
    async createTicketForUser(user) {
        // -- create
        let t = await util_1.Util.randomstring(20);
        let expire_sec = 60;
        let tObject = { user: user.name, ticket: t };
        // -- save
        let redisResult = await __common_1.common.hset(`tickets:${t}`, tObject, expire_sec);
        return tObject;
    },
};
//# sourceMappingURL=auth.js.map