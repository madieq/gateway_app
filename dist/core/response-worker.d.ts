declare let preset: {
    ERROR: {
        ok: boolean;
        status: number;
    };
    OK: {
        ok: boolean;
        status: number;
    };
    NOT_FOUND: {
        ok: boolean;
        status: number;
    };
    AUTHORIZE: {
        ok: boolean;
        status: number;
    };
    AUTH_OF_ACTION: {
        ok: boolean;
        status: number;
    };
    INVALID_JSON: {
        ok: boolean;
        status: number;
    };
    INVALID_TYPE: {
        ok: boolean;
        status: number;
    };
};
export declare type ResponseCode = keyof typeof preset;
export declare class ResponseFactory {
    static create(presetName: ResponseCode, messageOrData?: string | {
        [key: string]: any;
    }): Response;
}
export declare class Response {
    ok: boolean;
    status: number;
    code: string;
    message: string;
    stack: string;
    data: {
        [key: string]: any;
    };
    constructor(code?: string, message?: string, data?: {}, status?: number, ok?: boolean);
}
export {};
//# sourceMappingURL=response-worker.d.ts.map