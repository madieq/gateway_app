import User from "./User";
export declare class UserAccessRight {
    id: string;
    isReadSelf: boolean;
    isChangeSelfInfo: boolean;
    isChangeOtherUser: boolean;
    constructor(id?: string, isReadSelf?: boolean, isChangeSelfInfo?: boolean, isChangeOtherUser?: boolean);
}
export declare let ACCESS: {
    default: UserAccessRight;
    guest: UserAccessRight;
    user: UserAccessRight;
    admin: UserAccessRight;
};
export declare type ACCESS_NAMES = keyof typeof ACCESS;
export declare function getAccessByName(accessName: string): any;
export declare function validate(user: User, protectedArea?: ACCESS_NAMES[]): boolean;
//# sourceMappingURL=security.d.ts.map