module quill {

    import Widget   = feather.core.Widget
    import Bind     = feather.observe.Bind

    export enum NodeValueIcon {
        string = undefined,
        text = 'fa-pencil' as any,
        number = undefined,
        fraction = undefined,
        date = 'fa-calendar' as any,
        datetime = 'fa-clock' as any,
        boolean = undefined,
        list = 'fa-search' as any,
        enum = undefined
    }

    export class ValueNode extends Widget {

        @Bind({}) node: CustomTreeNode
        @Bind({}) value: Value
        @Bind({}) icon: string

        constructor(node: CustomTreeNode, value?: Value) {
            super()
            this.node = node
            this.value = value
            this.icon = NodeValueIcon[node.value.type] as any
        }
    }
}

