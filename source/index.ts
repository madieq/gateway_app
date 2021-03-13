import { ProcessWorker } from './core/process-worker'
import { config } from './config'
import { Logger } from './core/log'
import { Router } from './api/http-worker'
import { App } from './app'
import { Util } from './core/util'
import { RedisClient } from './redis'
import { auth } from './redis/scripts/auth'
import User from './core/User'
import UserFactory from './core/UserFactory'

async function main() {
    // init
    ProcessWorker.loadConfig(config)

    App.redis = await new RedisClient().connect()
    App.http = await new Router().connect()

    await auth.saveUserContext(UserFactory.create('guest'))
    await auth.saveUserContext(UserFactory.create('admin'))
    if (false) { // -- auth test
        let uc = await auth.getUserContext('admin')
        let a = await auth.createTokenForUser(uc)
        let ubt = await auth.getUserByToken(a.token)
        let rr = await auth.removeToken(a.token)
        let tick = await auth.createTicketForUser(uc)
        let tval = await auth.getUserByTicket(tick.ticket)
        return
    }
}
(async () => {
    try {
        Logger.info(`[APP] statring...`)
        await main()
        Logger.info(`[APP] started.`)
    } catch (error) {
        Logger.error(`[APP] ERROR stopping...`)
        Logger.error(`[APP] ${error.stack || error}`)
        await ProcessWorker.closeApp()
    }
})()