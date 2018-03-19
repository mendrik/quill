module quill {

    import TreeNode = feather.ui.tree.TreeNode
    import On       = feather.event.On
    import Scope    = feather.event.Scope

    export interface NodeDrop {
        from: string;
        to: string;
    }

    export class CustomTreeNode extends TreeNode<Node> {
        id = () => `${this.value.id}`
        parent: CustomTreeNode

        init(el: Element) {
            el.setAttribute('draggable', 'true')
        }

        @On({event: 'dragstart', scope: Scope.Direct})
        drag(ev: DragEvent) {
            ev.dataTransfer.setData("text", this.id());
        }

        @On({event: 'dragover', scope: Scope.Direct, preventDefault: true})
        dragover() {}

        @On({event: 'drop', scope: Scope.Direct})
        drop(ev: DragEvent) {
            const id = ev.dataTransfer.getData("text");
            this.triggerUp('node-drop', {
                from: id,
                to: this.id()
            } as NodeDrop)
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
