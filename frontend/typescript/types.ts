module quill {

    type ErrorType = 'validation'

    export interface Error {
        type: ErrorType,
        field: string,
        message: string
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
