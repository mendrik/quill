module quill {

    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe

    export class DefaultValueNode extends ValueNode {

        @Bind({}) selected = false

        constructor(node: CustomTreeNode, value?: Value) {
            super(node, value)
        }

        @Template()
        markup() {
            return `
            <li class="value-line default {{selected:selectedClass}}">
                <span>{{node.value.name}}</span>
                <span class="icon is-small">
                    <i class="fa {{icon}}"></i>
                </span>
            </li>`
        }

        @Subscribe('defocus-other-nodes')
        defocusByNode(node: CustomTreeNode) {
            this.selected = this.node === node
        }

        selectedClass = (selected: boolean) => selected ? 'selected' : undefined
    }
}

