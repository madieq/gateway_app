"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_worker_1 = require("./core/process-worker");
const config_1 = require("./config");
const log_1 = require("./core/log");
const http_worker_1 = require("./api/http-worker");
const app_1 = require("./app");
const auth_1 = require("./redis/scripts/auth");
const mongo_1 = require("./mongo");
async function main() {
    // init
    process_worker_1.ProcessWorker.loadConfig(config_1.config);
    // App.redis = await new RedisClient().connect()
    app_1.App.mongo = await new mongo_1.MongoClient().connect();
    app_1.App.http = await new http_worker_1.Router().connect();
    // await auth.saveUserContext(UserFactory.create('guest'))
    // await auth.saveUserContext(UserFactory.create('admin'))
    if (false) { // -- auth test
        let uc = await auth_1.auth.getUserContext('admin');
        let a = await auth_1.auth.createTokenForUser(uc);
        let ubt = await auth_1.auth.getUserByToken(a.token);
        let rr = await auth_1.auth.removeToken(a.token);
        let tick = await auth_1.auth.createTicketForUser(uc);
        let tval = await auth_1.auth.getUserByTicket(tick.ticket);
        return;
    }
}
(async () => {
    try {
        log_1.Logger.info(`[APP] statring...`);
        await main();
        log_1.Logger.info(`[APP] started.`);
    }
    catch (error) {
        log_1.Logger.error(`[APP] ERROR stopping...`);
        log_1.Logger.error(`[APP] ${error.stack || error}`);
        await process_worker_1.ProcessWorker.closeApp();
    }
})();
//# sourceMappingURL=index.js.map