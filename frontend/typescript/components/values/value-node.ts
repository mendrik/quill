module quill {

    import Template = feather.annotations.Template
    import Widget   = feather.core.Widget
    import Bind     = feather.observe.Bind

    export class ValueNode extends Widget {

        @Bind({}) node: CustomTreeNode
        @Bind({}) value: Value

        constructor(node: CustomTreeNode, value?: Value) {
            super()
            this.node = node
            this.value = value
        }

        @Template()
        markup() {
            return `<li>{{node.value.name}}</li>`
        }
    }
}

