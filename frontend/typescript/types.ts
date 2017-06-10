module quill {
    import TypedMap = feather.types.TypedMap
    import StringFactory = feather.xhr.StringFactory

    export const headers: TypedMap<string|StringFactory> = {
        'X-Api-Key': undefined,
        'Content-Type': 'application/json'
    }

    export interface User {
        id: number,
        name: string,
        email: string,
        lastProject: string
    }

    export interface ApiError {
        code: number,
        message: string
    }

    export interface IdParam {
        id: string
    }

}
