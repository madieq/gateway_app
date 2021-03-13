let preset = {
    ERROR: { ok: false, status: 500 },
    OK: { ok: true, status: 200 },
    NOT_FOUND: { ok: false, status: 404 },
    AUTHORIZE: { ok: false, status: 403 },
    AUTH_OF_ACTION: { ok: false, status: 401 },
    INVALID_JSON: { ok: false, status: 400 },
    INVALID_TYPE: { ok: false, status: 400 },
}

export type ResponseCode = keyof typeof preset

export class ResponseFactory {
    static create(presetName: ResponseCode, messageOrData: string | { [key: string]: any } = '') {
        let r: Response
        if (preset[presetName])
            if (typeof messageOrData === 'string')
                r = new Response(presetName, messageOrData, undefined, preset[presetName].status || 500, !!preset[presetName].ok)
            else {
                r = new Response(presetName, '', messageOrData || {}, preset[presetName].status || 500, !!preset[presetName].ok)
            }
        return r
    }
}

export class Response {
    ok = false
    status = 500
    code = 'ERROR'
    message: string = ''
    stack: string = ''
    data: { [key: string]: any } = {}
    constructor(code = '', message = '', data = {}, status = 500, ok = false) {
        this.code = code
        this.message = message
        this.data = data
        this.status = status
        this.ok = ok
    }
}

