module quill {

    import TreeNode = feather.ui.tree.TreeNode
    import On       = feather.event.On
    import Scope    = feather.event.Scope
    import isDef    = feather.functions.isDef

    export enum DropPostion {
        inside = 'inside',
        above = 'above',
        below = 'below'
    }

    export interface NodeDrop {
        from: number
        to: number,
        position: DropPostion,
        open
    }

    const NODE_DATA_TYPE = 'quill/node-id'

    export class CustomTreeNode extends TreeNode<Node> implements HasChildren<TreeNode<Node>> {
        parent: CustomTreeNode

        id = () => `${this.value.id}`

        init(el: Element) {
            el.setAttribute('draggable', 'true')
            el.setAttribute('tabindex', '-1')
        }

        @On({event: 'dragstart', scope: Scope.Direct})
        dragstart(ev: DragEvent) {
            ev.dataTransfer.setData(NODE_DATA_TYPE, this.id())
        }

        @On({event: 'dragover', scope: Scope.Direct, preventDefault: true})
        dragover(ev: DragEvent) {
            const relY = ev.clientY - this.element.getBoundingClientRect().top
            if (relY < 6) {
                this.element.setAttribute('data-dragover', DropPostion.above)
            } else if (relY > 18) {
                this.element.setAttribute('data-dragover', DropPostion.below)
            } else {
                this.element.setAttribute('data-dragover', DropPostion.inside)
            }
        }

        @On({event: 'dragleave', scope: Scope.Direct})
        dragleave() {
            setTimeout(() => // prevent flicker between :before <-> :after toggle
                this.element.removeAttribute('data-dragover'), 30)
        }

        @On({event: 'blur', selector: 'input', scope: Scope.Direct})
        blur(ev: DragEvent) {
            (this.element as HTMLElement).focus()
        }

        @On({event: 'drop', scope: Scope.Direct})
        drop(ev: DragEvent) {
            const id = ev.dataTransfer.getData(NODE_DATA_TYPE)
            this.dragleave()
            if (id) {
                this.triggerUp('node-drop', {
                    from: parseInt(id, 10),
                    to: parseInt(this.id(), 10),
                    position: this.element.getAttribute('data-dragover'),
                    open: this.children.length > 0 && this.open
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

        add(node: CustomTreeNode, index?: number) {
            if (isDef(index)) {
                this.children.splice(index, 0, node)
            } else {
                this.children.push(node)
            }
            node.parent = this
        }

        hasChildren(): boolean {
            return this.children.length > 0
        }

        allParentsOpen(): boolean {
            let p = this.parent
            while(p) {
                if (!p.open) {
                    return false
                }
                p = p.parent
            }
            return true
        }
    }
}
