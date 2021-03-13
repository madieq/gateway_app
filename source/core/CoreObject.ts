export default class CoreObject {
    $$type = 'CoreObject'
    assign(obj: { [key: string]: any }) {
        if (obj && typeof obj === 'object') {
            let self = this
            Object.keys(obj).forEach(k => { self[k] = obj[k] })
        }
        return this
    }
    stringify() {
        let self = this
        return JSON.stringify(self)
    }
    [key: string]: any
}