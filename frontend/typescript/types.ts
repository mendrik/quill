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
        schema: Node[],
        versions: Version[]
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

    export interface Version {
        id: string,
        name: string,
    }

    export type NodeRoot =
        'structure' |
        'schema'

    export type NodeType =
        'string'    |
        'multiline' |
        'number'    |
        'fraction'  |
        'enum'      |
        'boolean'   |
        'list'      |
        'date'      |
        'datetime'

    export enum MultilineType {
        normal = 'normal',
        richtext = 'richtext',
        markdown = 'markdown'
    }

    export enum IntegerType {
        input = 'input',
        slider = 'slider'
    }

    export enum BooleanType {
        checkbpx = 'checkbox',
        switch = 'switch'
    }

    export interface NodeConfig {
        type: NodeType,
        multiLine: {
            type: MultilineType
        },
        singleLine: {
            validation: string
        },
        enum: {
            values: string[]
        },
        integer: {
            min: number,
            max: number,
            type: IntegerType
        },
        fraction: {
        },
        date: {
        },
        datetime: {
        },
        boolean: {
            type: BooleanType
        },
        list: {

        },
        file: {
        }
    }
}
