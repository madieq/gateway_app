import User from "./User";

export default class UserFactory {
    static create(preset: 'guest' | 'admin') {
        switch (preset) {
            case 'guest': {
                return new User('guest')
            }
            case 'admin': {
                return new User('admin', ['admin'])
            } 
        }
    }
}