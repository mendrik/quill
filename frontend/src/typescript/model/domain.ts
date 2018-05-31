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

export interface NodeConfig {
    // todo
}

