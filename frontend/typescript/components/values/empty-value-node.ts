module quill {

    import Template = feather.annotations.Template

    export class EmptyValueNode extends ValueNode {

        constructor(node: CustomTreeNode, value?: Value) {
            super(node, value)
        }

        @Template()
        markup() {
            return `<li class="value-line empty"/>`
        }
    }
}

