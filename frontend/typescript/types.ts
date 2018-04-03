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
        'text'      |
        'number'    |
        'fraction'  |
        'enum'      |
        'boolean'   |
        'list'      |
        'date'      |
        'datetime'

    export enum MultilineEditor {
        normal = 'normal',
        richtext = 'richtext',
        markdown = 'markdown'
    }

    export enum NumberEditor {
        input = 'input',
        slider = 'slider'
    }

    export enum BooleanEditor {
        checkbpx = 'checkbox',
        switch = 'switch'
    }

    export interface NodeConfig {
        type: NodeType,
        string: {
            validation: string
        },
        multiline: {
            editor: MultilineEditor
        },
        enum: {
            values: string[]
        },
        number: {
            min: number,
            max: number
            editor: NumberEditor
        },
        fraction: {
            format: string
        },
        date: {
            format: string
        },
        datetime: {
            format: string
        },
        boolean: {
            editor: BooleanEditor
        },
        list: {
            filter: string
        }
    }
}
