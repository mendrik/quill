module quill {

    import Template = feather.annotations.Template
    import Widget   = feather.core.Widget

    export class ValueNode extends Widget {

        node: CustomTreeNode
        value: Value

        constructor(node: CustomTreeNode, value?: Value) {
            super()
            this.node = node
            this.value = value
        }

        @Template()
        markup() {
            return '<li>Value stuff</li>'
        }
    }
}

