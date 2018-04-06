module quill {

    import Template = feather.annotations.Template

    export class DefaultValueNode extends ValueNode {

        constructor(node: CustomTreeNode, value?: Value) {
            super(node, value)
        }

        @Template()
        markup() {
            return `
            <li class="value-line">
                <span>{{node.value.name}}</span>
                <span class="icon is-small">
                    <i class="fa {{icon}}"></i>
                </span>
            </li>`
        }
    }
}

