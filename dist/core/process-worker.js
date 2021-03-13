"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessWorker = void 0;
const util_1 = require("./util");
class ProcessWorker {
    static async closeApp(error) {
        await util_1.Util.sleep(100);
        process.exit();
    }
    static loadConfig(objConf) {
        process.env = Object.assign({}, process.env, objConf);
    }
}
exports.ProcessWorker = ProcessWorker;
//# sourceMappingURL=process-worker.js.map