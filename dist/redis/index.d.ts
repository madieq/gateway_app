import * as IORedis from 'ioredis';
import { Redis } from 'ioredis';
export declare class RedisClient {
    redisPrefix: string;
    redisUri: string;
    static LOG_PREFIX: string;
    client: Redis;
    connect(): Promise<this>;
    query(commands?: Array<Array<string>>): Promise<[Error, any][]>;
    queryOne(commandName: string, ...args: string[]): Promise<any>;
    duplicate(): Promise<IORedis.Redis>;
    lua(luaScriptName: string, ...args: string[]): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map