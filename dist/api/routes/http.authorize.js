"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = void 0;
const http_worker_1 = require("../http-worker");
const response_worker_1 = require("../../core/response-worker");
class Execute {
    init() {
        let routeOption = new http_worker_1.RouteOptions;
        routeOption.methods = ['post', 'get'];
        routeOption.access = [];
        routeOption.path = '/api/v1/auth/authorize';
        routeOption.callback = async (state) => {
            state.out = response_worker_1.ResponseFactory.create('OK', {});
        };
        return routeOption;
    }
}
exports.Execute = Execute;
//# sourceMappingURL=http.authorize.js.map