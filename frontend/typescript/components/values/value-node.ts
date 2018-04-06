module quill {

    import Widget   = feather.core.Widget
    import Bind     = feather.observe.Bind

    export class ValueNode extends Widget {

        @Bind({}) node: CustomTreeNode
        @Bind({}) value: Value
        @Bind({}) icon: string

        constructor(node: CustomTreeNode, value?: Value) {
            super()
            this.node = node
            this.value = value
            this.icon = NodeIcon[node.value.type] as any
        }
    }
}

