module quill {

    import TypedMap = feather.types.TypedMap
    import StringFactory = feather.xhr.StringFactory

    const AUTH_HEADER = 'X-Auth-Token'

    export const headers: TypedMap<string|StringFactory> = {
        'X-Api-Key': 'AbCdEfGhIjK1',
        'Content-Type': 'application/json',
        [AUTH_HEADER]: localStorage.getItem(AUTH_HEADER)
    }

    export const setToken = (token: Token) => {
        localStorage.setItem(AUTH_HEADER, token.token)
        headers[AUTH_HEADER] = token.token
    }

    export const removeToken = () => {
        localStorage.removeItem(AUTH_HEADER)
        headers[AUTH_HEADER] = undefined
    }

}
