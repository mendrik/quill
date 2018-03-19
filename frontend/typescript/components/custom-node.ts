module quill {

    import TreeNode = feather.ui.tree.TreeNode
    import On       = feather.event.On
    import Scope    = feather.event.Scope

    export interface NodeDrop {
        from: string;
        to: string;
    }

    const NODE_DATA_TYPE = "quill/node-id"

    export class CustomTreeNode extends TreeNode<Node> {
        id = () => `${this.value.id}`
        parent: CustomTreeNode

        init(el: Element) {
            el.setAttribute('draggable', 'true')
        }

        @On({event: 'dragstart', scope: Scope.Direct})
        dragstart(ev: DragEvent) {
            ev.dataTransfer.setData(NODE_DATA_TYPE, this.id())
        }

        @On({event: 'dragover', scope: Scope.Direct, preventDefault: true})
        dragover(ev: DragEvent) {
        }

        @On({event: 'dragenter', scope: Scope.Direct})
        dragenter(ev: DragEvent) {
            this.element.setAttribute('data-dragover', 'true');
        }

        @On({event: 'dragleave', scope: Scope.Direct})
        dragleave(ev: DragEvent) {
            this.element.removeAttribute('data-dragover');
        }

        @On({event: 'drop', scope: Scope.Direct})
        drop(ev: DragEvent) {
            const id = ev.dataTransfer.getData(NODE_DATA_TYPE);
            this.dragleave(ev)
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
                let child = CustomTreeNode.toTreeNode(n)
                child.parent = tn
                return child
            }))
            return tn
        }
    }
}
