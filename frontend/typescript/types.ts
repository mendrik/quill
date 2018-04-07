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

    export interface Value {
        nodeId: number,
        arrVal: boolean,
        strVal: string
        numVal: number,
        decVal: number,
        dateVal: string,
        boolVal: boolean,
        config: NodeConfig
    }

    export interface Version {
        id: string,
        name: string,
        project: number,
        icon: string,
        values: Value[]
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
        nodeType: NodeType,
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
            editor: BooleanEditor,
            label: string
        },
        list: {
            filter: string
        }
    }

    export const dummyNodeConfig: NodeConfig = {
        nodeType: 'string',
        string: {validation: ''},
        multiline: {editor: MultilineEditor.normal},
        enum: {values: []},
        number: {editor: NumberEditor.input, min: null, max: null},
        fraction: {format: ''},
        date: {format: ''},
        datetime: {format: ''},
        boolean: {editor: BooleanEditor.switch, label: ''},
        list: {filter: ''},
    }
}
