import CoreObject from "./CoreObject";
import { ACCESS_NAMES } from "./security";
export default class User extends CoreObject {
    name: string;
    access: ACCESS_NAMES[];
    constructor(name?: string, access?: ACCESS_NAMES[]);
}
//# sourceMappingURL=User.d.ts.map