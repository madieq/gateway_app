import CoreObject from "./CoreObject";
import { ACCESS_NAMES } from "./security"

export default class User extends CoreObject {
    constructor(
        public name = 'default_user'
        , public access: ACCESS_NAMES[] = []
        , public email: string = ''
        , public credentials: string = ''
        , public userSecret: string = ''
    ) {
        super();
        this.$$type = Object.getPrototypeOf(this).constructor.name
    }
}