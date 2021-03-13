import { RouteOptions, RouteState } from '../http-worker'
import { ResponseFactory } from '../../core/response-worker'
import * as sha256 from 'sha256'
import * as EmailValidator from 'email-validator'
import User from '../../core/User'
import { auth } from '../../mongo/scripts/auth'
import { Util } from '../../core/util'

export class Execute {
    init() {
        let routeOption = new RouteOptions
        routeOption.methods = ['post']
        routeOption.access = []
        routeOption.path = '/api/v1/auth/register'
        routeOption.callback = async (state: RouteState) => {
            let input: any = state.input;
            // -- validate
            input.login = (input.login + '').trim().toLowerCase()
            if (!/[a-z][a-z0-9_]{3,10}/.test(input.login))
                throw ResponseFactory.create('INVALID_TYPE', 'invalid login')
            if (!/[a-zA-Z0-9_]{6,256}/.test(input.pass))
                throw ResponseFactory.create('INVALID_TYPE', 'invalid password')
            if (!EmailValidator.validate(input.email))
                throw ResponseFactory.create('INVALID_TYPE', 'invalid email')

            let hashOfCredentials = sha256.x2(state.input.login + state.input.pass)
            let randomUserSecret = await Util.randomstring(20)
            let user = new User(state.input.login, ['user'], state.input.email, hashOfCredentials, randomUserSecret)
            let rOut = await auth.registerUser(user)

            state.out = ResponseFactory.create('OK', { result: rOut })
        }
        return routeOption
    }
}