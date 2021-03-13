import User from "../../core/User";

export const SchemaUser = {
    name: { type: String, index: { unique: true } },
    access: Array,
    email: { type: String, index: { unique: true } },
    credentials: String,
    userSecret: String,
}