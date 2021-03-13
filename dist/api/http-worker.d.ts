import { Express, Response as ResponseExpress } from 'express';
import { Response } from './../core/response-worker';
import User from './../core/User';
import { ACCESS_NAMES } from '../core/security';
export declare class RouteState {
    path: string;
    user: User;
    headers: any;
    output_headers: any;
    input: any;
    out: any;
}
export declare class RouteOptions {
    methods: string[];
    path: string;
    callback: (state: RouteState) => Promise<void>;
    access: ACCESS_NAMES[];
}
export declare class Router {
    static LOG_PREFIX: string;
    port: string | number;
    express: Express;
    connect(port?: string | number): Promise<this>;
    static send(res: ResponseExpress, body: Response, headers?: object): void;
    static createRoute(express: Express, routeSettings: RouteOptions[]): void;
    static loadRoutes(): Promise<RouteOptions[]>;
}
//# sourceMappingURL=http-worker.d.ts.map