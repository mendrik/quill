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
        name: string,
        structure: Node[],
        schema: Node[]
    }

    export interface Node {
        id: number,
        name: string,
        type: NodeType,
        root: NodeRoot,
        order: number
        children: Node[]
    }

    export interface NewNode {
        name: string,
        sort: number
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
