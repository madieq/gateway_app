import { Express, Response as ResponseExpress, Request as RequestExpress } from 'express'
import { Logger } from './../core/log'
import { Response, ResponseFactory, ResponseCode } from './../core/response-worker'
import User from './../core/User'
import * as fse from 'fs-extra'
import { ACCESS_NAMES } from '../core/security'
import * as jwt from 'jsonwebtoken'

export class RouteState {
    path = '*'
    user: User
    headers: any = {}
    output_headers: any = {}
    input: any = {}
    out: any = {}
}

export class RouteOptions {
    methods = ["post", "get"]
    path = '*'
    callback = async (state: RouteState) => { }
    access: ACCESS_NAMES[] = ['admin']
}

export class Router {
    static LOG_PREFIX = `[HTTP]`
    port: string | number = process.env.HTTP_PORT || '8000'
    express: Express
    async connect(port?: string | number) {
        this.port = port || this.port
        this.express = (require('express')())
        if (process.env.CORS)
            this.express.use(require('cors')())
        this.express.use(require('body-parser').json({ limit: '20mb' }))
        this.express.all('*', async (req, res, next: any) => {
            // -- GET CONTEXT BY TOKEN
            let authToken = ((req.headers || {}).authorization || '').replace(/Bearer /g, '');
            (req as any).user = new User

            //validate user
            // (req as any).user = await Auth.getUserByToken(authToken)
            next()
        })
        let loadedRoutes = await Router.loadRoutes()
        Router.createRoute(this.express, loadedRoutes)
        this.express.all('*', async (req, res, next) => { Router.send(res, ResponseFactory.create('NOT_FOUND', 'express route not found')) })
        this.express.listen(this.port, () => { Logger.info(`${Router.LOG_PREFIX} ${this.port} listen...`) })
        return this
    }

    static send(res: ResponseExpress, body: Response, headers: object = {}) {
        if (body instanceof Response)
            res.status(body.status)
        res.set(headers).json(body)
    }
    static createRoute(express: Express, routeSettings: RouteOptions[]) {
        routeSettings.map(s => {
            s.methods.map(method => {
                express[method](s.path, async (req: RequestExpress, res: ResponseExpress, next) => {
                    try {
                        // -- VALIDATE ACCESS
                        let state = new RouteState
                        state.headers = req.headers
                        state.path = req.baseUrl
                        state.user = (req as any).user
                        state.input = Object.assign({}, req.body, req.query)
                        // -- run exec
                        await s.callback(state)
                        // -- out
                        Router.send(res, state.out, state.output_headers)
                    } catch (error) {
                        if (!(error instanceof Response))
                            error = ResponseFactory.create('ERROR', error.message || error)
                        Router.send(res, error, {})
                        return
                    }
                })
            })
        })
        return
    }
    static async loadRoutes(): Promise<RouteOptions[]> {
        let path = require('path')
        let pathToDir = path.resolve(process.cwd(), 'dist', 'api', 'routes')
        await fse.ensureDir(pathToDir)
        let all = ((await fse.readdir(pathToDir)) || []).filter(k => /^(http\.).+\.js$/.test(k))
        let r: RouteOptions[] = []
        for (let o of all) {
            try {
                let pathElement = path.join(pathToDir, o)
                let { Execute } = require(pathElement)
                let rOne = new Execute().init()
                r.push(rOne)
                Logger.info(`${this.LOG_PREFIX} [+] ${rOne.methods.map(i => i.toUpperCase()).join(',')} ${rOne.path} => ${o}`)
            } catch (error) {
                error
            }
        }
        return r
    }
}
