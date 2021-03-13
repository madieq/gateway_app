"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CoreObject_1 = __importDefault(require("./CoreObject"));
class User extends CoreObject_1.default {
    constructor(name = '_', access = []) {
        super();
        this.name = name;
        this.access = access;
        this.$$type = Object.getPrototypeOf(this).constructor.name;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map