import User from "../../core/User";
import { TicketStorage, TokenStorage } from "./__interface";
export declare const auth: {
    saveUserContext(user: User): Promise<boolean>;
    registerUser(emailHash: string, hashOfCredentials: string, user: User): Promise<any>;
    getUserByLoginPass(login?: string, hashed_pass?: string): Promise<void>;
    getUserContext(userName: string): Promise<User>;
    getUserByTicket(t: string): Promise<User>;
    createTokenForUser(user: User): Promise<TokenStorage>;
    getUserByToken(token: string): Promise<User>;
    removeToken(token: string): Promise<boolean>;
    createTicketForUser(user: User): Promise<TicketStorage>;
};
//# sourceMappingURL=auth.d.ts.map