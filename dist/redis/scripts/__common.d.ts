export declare const common: {
    hset(key: string, data: {
        [key: string]: any;
    }, expire?: string | number): Promise<boolean>;
    hgetall(key: string, isDeleteAfter?: boolean): Promise<object>;
    delete(key: string): Promise<boolean>;
};
//# sourceMappingURL=__common.d.ts.map