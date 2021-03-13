import { Response } from './response-worker'
import { Util } from './util'

export class ProcessWorker {
    static async closeApp(error?: Response) {
        await Util.sleep(100)
        process.exit()
    }
    static loadConfig(objConf: any) {
        process.env = Object.assign({}, process.env, objConf)
    }
}