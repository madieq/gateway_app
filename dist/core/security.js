"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.getAccessByName = exports.ACCESS = exports.UserAccessRight = void 0;
class UserAccessRight {
    constructor(id = 'guest', isReadSelf = false, isChangeSelfInfo = false, isChangeOtherUser = false) {
        this.id = id;
        this.isReadSelf = isReadSelf;
        this.isChangeSelfInfo = isChangeSelfInfo;
        this.isChangeOtherUser = isChangeOtherUser;
    }
}
exports.UserAccessRight = UserAccessRight;
exports.ACCESS = {
    default: new UserAccessRight(),
    guest: new UserAccessRight('guest'),
    user: new UserAccessRight('user', true, true),
    admin: new UserAccessRight('admin', true, true, true),
};
function getAccessByName(accessName) {
    if (!exports.ACCESS[accessName])
        return exports.ACCESS.default;
    return exports.ACCESS[accessName];
}
exports.getAccessByName = getAccessByName;
function validate(user, protectedArea = []) {
    let userSummaryRights = {};
    user.access.map(accessName => {
        let a = getAccessByName(accessName);
        Object.keys(a).map(k => {
            if (a[k] === true)
                userSummaryRights[k] = true; //.push(k)
        });
    });
    let needAccess = [];
    protectedArea.map(accessName => {
        let a = getAccessByName(accessName);
        Object.keys(a).map(k => {
            if (a[k] === true)
                needAccess.push(k);
        });
    });
    for (let i of needAccess) {
        if (!Object.keys(userSummaryRights).includes(i))
            return false;
    }
    return true;
}
exports.validate = validate;
//# sourceMappingURL=security.js.map