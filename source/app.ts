import { Router } from "./api/http-worker"
import { RedisClient } from "./redis"

export class App {
    static redis: RedisClient
    static http: Router
}