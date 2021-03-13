"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CoreObject_1 = __importDefault(require("./CoreObject"));
class User extends CoreObject_1.default {
    constructor(name = 'default_user', access = [], email = '', credentials = '', userSecret = '') {
        super();
        this.name = name;
        this.access = access;
        this.email = email;
        this.credentials = credentials;
        this.userSecret = userSecret;
        this.$$type = Object.getPrototypeOf(this).constructor.name;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map