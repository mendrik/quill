module quill {

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
