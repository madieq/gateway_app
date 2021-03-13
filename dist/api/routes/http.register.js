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
exports.Execute = void 0;
const http_worker_1 = require("../http-worker");
const response_worker_1 = require("../../core/response-worker");
const sha256 = __importStar(require("sha256"));
const EmailValidator = __importStar(require("email-validator"));
const User_1 = __importDefault(require("../../core/User"));
const auth_1 = require("../../mongo/scripts/auth");
const util_1 = require("../../core/util");
class Execute {
    init() {
        let routeOption = new http_worker_1.RouteOptions;
        routeOption.methods = ['post'];
        routeOption.access = [];
        routeOption.path = '/api/v1/auth/register';
        routeOption.callback = async (state) => {
            let input = state.input;
            // -- validate
            input.login = (input.login + '').trim().toLowerCase();
            if (!/[a-z][a-z0-9_]{3,10}/.test(input.login))
                throw response_worker_1.ResponseFactory.create('INVALID_TYPE', 'invalid login');
            if (!/[a-zA-Z0-9_]{6,256}/.test(input.pass))
                throw response_worker_1.ResponseFactory.create('INVALID_TYPE', 'invalid password');
            if (!EmailValidator.validate(input.email))
                throw response_worker_1.ResponseFactory.create('INVALID_TYPE', 'invalid email');
            let hashOfCredentials = sha256.x2(state.input.login + state.input.pass);
            let randomUserSecret = await util_1.Util.randomstring(20);
            let user = new User_1.default(state.input.login, ['user'], state.input.email, hashOfCredentials, randomUserSecret);
            let rOut = await auth_1.auth.registerUser(user);
            state.out = response_worker_1.ResponseFactory.create('OK', { result: rOut });
        };
        return routeOption;
    }
}
exports.Execute = Execute;
//# sourceMappingURL=http.register.js.map