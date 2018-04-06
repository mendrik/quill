module quill {

    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe

    export class BooleanValueNode extends ValueNode {

        @Bind({}) selected = false

        @Template()
        markup() {
            return `
            <li class="value-line default boolean {{selected:selectedClass}}">
                <div>
                    <div class="field">
                        <input id={{id}}
                               type="checkbox"
                               name="switchRoundedOutlinedDefault"
                               class="switch is-rounded is-outlined is-small">
                        <label for={{id}}></label>
                    </div>
                </div>
                <span/>
            </li>`
        }

        @Subscribe('defocus-other-nodes')
        defocusByNode(node: CustomTreeNode) {
            this.selected = this.node === node
        }

        selectedClass = (selected: boolean) => selected ? 'selected' : undefined
    }
}

