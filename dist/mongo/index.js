"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoClient = void 0;
const log_1 = require("../core/log");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const app_1 = require("../app");
const User_1 = require("./schema/User");
class MongoClient {
    async connect() {
        log_1.Logger.info(`${MongoClient.LOG_PREFIX} connecting ${process.env.MONGO_URI_FULL}...`);
        let mongoConnect = await mongoose_1.default.connect(`${process.env.MONGO_URI_FULL || ''}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        app_1.App.users = mongoose_1.default.model('users', new mongoose_2.Schema(User_1.SchemaUser), 'users');
        log_1.Logger.info(`${MongoClient.LOG_PREFIX} connected`);
        return this;
    }
}
exports.MongoClient = MongoClient;
MongoClient.LOG_PREFIX = `[MONGO]`;
//# sourceMappingURL=index.js.map