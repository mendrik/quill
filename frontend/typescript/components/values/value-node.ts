module quill {

    import Widget   = feather.core.Widget
    import Bind     = feather.observe.Bind

    export enum NodeValueIcon {
        string = undefined,
        text = 'fa-pencil' as any,
        number = undefined,
        fraction = undefined,
        date = 'fa-calendar' as any,
        datetime = 'fa-clock-o' as any,
        boolean = undefined,
        list = 'fa-search' as any,
        enum = undefined
    }

    export class ValueNode extends Widget {

        @Bind({}) version: string
        @Bind({}) node: CustomTreeNode
        @Bind({}) value: Value
        @Bind({}) icon: string
        @Bind({}) id: string

        constructor(node: CustomTreeNode, version: string, value?: Value) {
            super()
            this.node = node
            this.value = value
            this.version = version
            this.icon = NodeValueIcon[node.value.type] as any
            this.id = `${version}-${node.value.id}`
        }
    }
}

