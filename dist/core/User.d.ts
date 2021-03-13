import CoreObject from "./CoreObject";
import { ACCESS_NAMES } from "./security";
export default class User extends CoreObject {
    name: string;
    access: ACCESS_NAMES[];
    email: string;
    credentials: string;
    userSecret: string;
    constructor(name?: string, access?: ACCESS_NAMES[], email?: string, credentials?: string, userSecret?: string);
}
//# sourceMappingURL=User.d.ts.map