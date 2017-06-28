module quill {

    type ErrorType = 'validation'

    export enum Keys {
        ENTER = 13
    }

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
        firstname: string,
        lastname: string,
        lastProject: string
    }

    export interface Project {
        id: number,
        name: string
    }

    export interface Node {
        name: string,
        type: NodeType
    }

    export interface ApiError {
        code: number,
        message: string
    }

    export interface IdParam {
        id: string
    }

    export type NodeRoot = 'structure' | 'schema'

    export type NodeType = 'string' | 'number' | 'enum' | 'boolean' | 'node' | 'list'

}
