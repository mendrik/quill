module quill {

    import TreeNode = feather.ui.tree.TreeNode
    import On       = feather.event.On
    import Scope    = feather.event.Scope

    export class CustomTreeNode extends TreeNode<Node> {
        id = () => `${this.value.id}`
        parent: CustomTreeNode

        init(el: Element) {
            el.setAttribute('draggable', 'true')
        }

        @On({event: 'drag', scope: Scope.Direct})
        drag(ev: DragEvent) {
            console.log(ev)
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
