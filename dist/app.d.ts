import { Router } from "./api/http-worker";
import { MongoClient } from "./mongo";
import { RedisClient } from "./redis";
import { Document, Model } from 'mongoose';
export declare class App {
    static mongo: MongoClient;
    static redis: RedisClient;
    static http: Router;
    static users: Model<Document>;
}
//# sourceMappingURL=app.d.ts.map