module quill {

    import TreeNode = feather.ui.tree.TreeNode
    import On       = feather.event.On
    import Scope    = feather.event.Scope

    export interface NodeDrop {
        from: string
        to: string
    }

    const NODE_DATA_TYPE = 'quill/node-id'

    export class CustomTreeNode extends TreeNode<Node> {
        parent: CustomTreeNode

        id = () => `${this.value.id}`

        init(el: Element) {
            el.setAttribute('draggable', 'true')
        }

        @On({event: 'dragstart', scope: Scope.Direct})
        dragstart(ev: DragEvent) {
            ev.dataTransfer.setData(NODE_DATA_TYPE, this.id())
        }

        @On({event: 'dragover', scope: Scope.Direct, preventDefault: true})
        dragover(ev: DragEvent) {
            const relY = ev.clientY - this.element.getBoundingClientRect().top
            if (relY < 6) {
                this.element.setAttribute('data-dragover', 'above')
            } else if (relY > 18) {
                this.element.setAttribute('data-dragover', 'below')
            } else {
                this.element.setAttribute('data-dragover', 'inside')
            }
        }

        @On({event: 'dragleave', scope: Scope.Direct})
        dragleave() {
            setTimeout(() => // prevent flicker between :before <-> :after toggle
                this.element.removeAttribute('data-dragover'), 30)
        }

        @On({event: 'drop', scope: Scope.Direct})
        drop(ev: DragEvent) {
            const id = ev.dataTransfer.getData(NODE_DATA_TYPE)
            this.dragleave()
            if (id) {
                this.triggerUp('node-drop', {
                    from: id,
                    to: this.id()
                } as NodeDrop)
            }
        }

        static toTreeNode = (n: Node) => {
            const tn = new CustomTreeNode(n.name, n, quill.iconFor(n.type))
            tn.children.push(...n.children.map(n => {
                const child = CustomTreeNode.toTreeNode(n)
                child.parent = tn
                return child
            }))
            return tn
        }
    }
}
