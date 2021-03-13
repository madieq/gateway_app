"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaUser = void 0;
exports.SchemaUser = {
    name: { type: String, index: { unique: true } },
    access: Array,
    email: { type: String, index: { unique: true } },
    credentials: String,
    userSecret: String,
};
//# sourceMappingURL=User.js.map