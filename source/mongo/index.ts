import { Logger } from "../core/log";
import { ResponseFactory } from "../core/response-worker";
import { Util } from '../core/util'
import * as fse from 'fs-extra'
import * as path from 'path'
import mongoose from 'mongoose'
import { Document, Schema } from 'mongoose'
import { App } from "../app";
import { SchemaUser } from "./schema/User";

export class MongoClient {
    static LOG_PREFIX = `[MONGO]`
    async connect() {
        Logger.info(`${MongoClient.LOG_PREFIX} connecting ${process.env.MONGO_URI_FULL}...`)
        let mongoConnect = await mongoose.connect(`${process.env.MONGO_URI_FULL || ''}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        App.users = mongoose.model('users', new Schema(SchemaUser), 'users')
        Logger.info(`${MongoClient.LOG_PREFIX} connected`)
        return this
    }
}