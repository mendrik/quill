module quill {

    type ErrorType = 'validation'

    export interface Error {
        type: ErrorType,
        title: string,
        message: string
    }

    export interface Errors {
        errors: Error[]
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
