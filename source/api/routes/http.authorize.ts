import { RouteOptions, RouteState } from '../http-worker'
import { ResponseFactory } from '../../core/response-worker'
import { auth } from '../../redis/scripts/auth'
import sha256 from 'sha256'
import User from '../../core/User'

export class Execute {
    init() {
        let routeOption = new RouteOptions
        routeOption.methods = ['post', 'get']
        routeOption.access = []
        routeOption.path = '/api/v1/auth/authorize'
        routeOption.callback = async (state: RouteState) => {
            state.out = ResponseFactory.create('OK', {})
        }
        return routeOption
    }
}