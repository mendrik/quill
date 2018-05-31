import {Token} from '../model/login'

const AUTH_HEADER = 'X-Auth-Token'

export type Headers = {[s: string]: string}

export const header = (): Headers => ({
    'X-Api-Key': 'AbCdEfGhIjK1',
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
    [AUTH_HEADER]: localStorage.getItem(AUTH_HEADER)
})

export const setToken = (token: Token) => {
    localStorage.setItem(AUTH_HEADER, token.token)
}

export const removeToken = () => {
    localStorage.removeItem(AUTH_HEADER)
}
