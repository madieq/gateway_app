"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class UserFactory {
    static create(preset) {
        switch (preset) {
            case 'guest': {
                return new User_1.default('guest');
            }
            case 'admin': {
                return new User_1.default('admin', ['admin']);
            }
        }
    }
}
exports.default = UserFactory;
//# sourceMappingURL=UserFactory.js.map