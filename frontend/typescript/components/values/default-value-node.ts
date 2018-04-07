module quill {

    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import On = feather.event.On
    import Scope = feather.event.Scope
    import isKey = keys.isKey
    import Key = keys.Key

    export class DefaultValueNode extends ValueNode {

        @Bind() selected = false
        @Bind() editing = false
        @Bind() text = ''

        constructor(node: CustomTreeNode, version: string, value?: Value) {
            super(node, version, value)
            this.text = this.getValue()
        }

        @Template()
        markup() {
            return `
            <li class="value-line default {{selected:selectedClass}}" {{editing}}>
                <span class="node-value">{{text}}</span>
                <input class="node-value-editor">
                <span class="icon is-small">
                    <i class="fa {{icon}}"></i>
                </span>
            </li>`
        }

        @On({event: 'dblclick'})
        startEditing(ev, el) {
            ev.stopImmediatePropagation()
            const inp = this.element.querySelector('input')
            inp.value = this.getValue()
            this.editing = true
            inp.focus()
            inp.select()
        }

        @On({event: 'blur', selector: 'input', scope: Scope.Direct})
        private cancelEditing() {
            if (this.editing) {
                this.editing = false
            }
        }

        @On({event: 'keydown', selector: 'input', scope: Scope.Direct})
        private stopEditing(ev: KeyboardEvent) {
            if (this.editing) {
                if (isKey(ev, Key.Enter)) {
                    this.setValue((ev.target as HTMLInputElement).value)
                    this.editing = false
                } else if (isKey(ev, Key.Esc)) {
                    this.editing = false
                }
            }
        }

        getValue(): string {
            switch (this.node.value.type) {
                case 'string': return this.value.strVal
                case 'text': return this.value.strVal
                case 'number': return `${this.value.numVal}`
                case 'fraction': return `${this.value.decVal}`
            }
        }

        setValue(val: string) {
            switch (this.node.value.type) {
                case 'string': this.value.strVal = val; break
                case 'text': this.value.strVal = val; break
                case 'number': this.value.numVal = parseInt(val, 10); break
                case 'fraction': this.value.decVal = parseFloat(val); break
            }
            this.text = this.getValue()
        }

        @Subscribe('defocus-other-nodes')
        defocusByNode(node: CustomTreeNode) {
            this.selected = this.node === node
        }

        selectedClass = (selected: boolean) => selected ? 'selected' : undefined
    }
}

