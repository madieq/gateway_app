import User from "./User"

export class UserAccessRight {
    constructor(
        public id = 'guest',
        public isReadSelf = false,
        public isChangeSelfInfo = false,
        public isChangeOtherUser = false,
    ) { }
}
export let ACCESS = {
    default: new UserAccessRight(),
    guest: new UserAccessRight('guest'),
    user: new UserAccessRight('user', true, true),
    admin: new UserAccessRight('admin', true, true, true),
}
export type ACCESS_NAMES = keyof typeof ACCESS
export function getAccessByName(accessName: string) {
    if (!ACCESS[accessName])
        return ACCESS.default
    return ACCESS[accessName]
}
export function validate(user: User, protectedArea: ACCESS_NAMES[] = []) {
    let userSummaryRights: any = {}
    user.access.map(accessName => {
        let a = getAccessByName(accessName)
        Object.keys(a).map(k => {
            if (a[k] === true)
                userSummaryRights[k] = true//.push(k)
        })
    })
    let needAccess: string[] = []
    protectedArea.map(accessName => {
        let a = getAccessByName(accessName)
        Object.keys(a).map(k => {
            if (a[k] === true)
                needAccess.push(k)
        })
    })
    for (let i of needAccess) {
        if (!Object.keys(userSummaryRights).includes(i))
            return false
    }
    return true
}