module quill {

    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import On = feather.event.On

    export class EnumValueNode extends ValueNode {

        @Bind() selected = false
        @Bind() text = ''

        constructor(node: CustomTreeNode, version: string, value?: Value) {
            super(node, version, value)
            this.text = this.value.strVal
        }

        @Template()
        markup() {
            return `
            <li class="value-line default toggler enum {{selected:selectedClass}}">
                <span class="node-value">{{text}}</span>
                <ul class="toggle open-in-view">
                    <li>Value 1</li>
                    <li>Value 2</li>
                    <li>Value 3</li>
                    <li>Value 4</li>
                    <li>Value 5</li>
                </ul>
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

