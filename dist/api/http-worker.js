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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.RouteOptions = exports.RouteState = void 0;
const log_1 = require("./../core/log");
const response_worker_1 = require("./../core/response-worker");
const User_1 = __importDefault(require("./../core/User"));
const fse = __importStar(require("fs-extra"));
class RouteState {
    constructor() {
        this.path = '*';
        this.headers = {};
        this.output_headers = {};
        this.input = {};
        this.out = {};
    }
}
exports.RouteState = RouteState;
class RouteOptions {
    constructor() {
        this.methods = ["post", "get"];
        this.path = '*';
        this.callback = async (state) => { };
        this.access = ['admin'];
    }
}
exports.RouteOptions = RouteOptions;
class Router {
    constructor() {
        this.port = process.env.HTTP_PORT || '8000';
    }
    async connect(port) {
        this.port = port || this.port;
        this.express = (require('express')());
        if (process.env.CORS)
            this.express.use(require('cors')());
        this.express.use(require('body-parser').json({ limit: '20mb' }));
        this.express.all('*', async (req, res, next) => {
            // -- GET CONTEXT BY TOKEN
            let authToken = ((req.headers || {}).authorization || '').replace(/Bearer /g, '');
            req.user = new User_1.default;
            //validate user
            // (req as any).user = await Auth.getUserByToken(authToken)
            next();
        });
        let loadedRoutes = await Router.loadRoutes();
        Router.createRoute(this.express, loadedRoutes);
        this.express.all('*', async (req, res, next) => { Router.send(res, response_worker_1.ResponseFactory.create('NOT_FOUND', 'express route not found')); });
        this.express.listen(this.port, () => { log_1.Logger.info(`${Router.LOG_PREFIX} ${this.port} listen...`); });
        return this;
    }
    static send(res, body, headers = {}) {
        if (body instanceof response_worker_1.Response)
            res.status(body.status);
        res.set(headers).json(body);
    }
    static createRoute(express, routeSettings) {
        routeSettings.map(s => {
            s.methods.map(method => {
                express[method](s.path, async (req, res, next) => {
                    try {
                        // -- VALIDATE ACCESS
                        let state = new RouteState;
                        state.headers = req.headers;
                        state.path = req.baseUrl;
                        state.user = req.user;
                        state.input = Object.assign({}, req.body, req.query);
                        // -- run exec
                        await s.callback(state);
                        // -- out
                        Router.send(res, state.out, state.output_headers);
                    }
                    catch (error) {
                        if (!(error instanceof response_worker_1.Response))
                            error = response_worker_1.ResponseFactory.create('ERROR', error.message || error);
                        Router.send(res, error, {});
                        return;
                    }
                });
            });
        });
        return;
    }
    static async loadRoutes() {
        let path = require('path');
        let pathToDir = path.resolve(process.cwd(), 'dist', 'api', 'routes');
        await fse.ensureDir(pathToDir);
        let all = ((await fse.readdir(pathToDir)) || []).filter(k => /^(http\.).+\.js$/.test(k));
        let r = [];
        for (let o of all) {
            try {
                let pathElement = path.join(pathToDir, o);
                let { Execute } = require(pathElement);
                let rOne = new Execute().init();
                r.push(rOne);
                log_1.Logger.info(`${this.LOG_PREFIX} [+] ${rOne.methods.map(i => i.toUpperCase()).join(',')} ${rOne.path} => ${o}`);
            }
            catch (error) {
                error;
            }
        }
        return r;
    }
}
exports.Router = Router;
Router.LOG_PREFIX = `[HTTP]`;
//# sourceMappingURL=http-worker.js.map