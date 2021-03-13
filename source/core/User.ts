import CoreObject from "./CoreObject";
import { ACCESS_NAMES } from "./security"

export default class User extends CoreObject {
    constructor(
        public name = '_'
        , public access: ACCESS_NAMES[] = []
    ) {
        super();
        this.$$type = Object.getPrototypeOf(this).constructor.name
    }
}