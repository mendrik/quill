module quill.components {

    import GestureWidget = feather.ui.events.GestureWidget
    import Construct = feather.annotations.Construct
    import Subscribe = feather.hub.Subscribe
    import On = feather.event.On
    import TypedMap = feather.types.TypedMap
    import Rest = feather.xhr.Rest
    import Bind = feather.observe.Bind
    import Template = feather.annotations.Template
    import removeFromArray = feather.arrays.removeFromArray
    import TreeNode = feather.ui.tree.TreeNode;

    @Construct({selector: 'selectable-tree-label', attributes: ['label', 'selected', 'type']})
    export class SelectableTreeLabel extends GestureWidget {

        static labels: SelectableTreeLabel[] = []

        @Bind() selected: boolean
        @Bind() label: string
        type: string

        constructor(label: string, selected: boolean, type: string) {
            super();
            this.label = label
            this.selected = selected
            this.type = type
            SelectableTreeLabel.labels.push(this)
        }

        init() {
            this.render()
        }

        @On({event: 'tap'})
        click() {
            this.selected = true;
            this.triggerUp('root-type-selected', this.type)
            SelectableTreeLabel.labels.forEach(l => {
                if (l !== this) {
                    l.selected = false
                }
            })
        }

        @Subscribe('defocus-other-nodes')
        nodeSelected(node: TreeNode<any>) {
            if (node) {
                this.selected = false
            }
        }

        @Template()
        markup() {
            return (
            `<p class="menu-label clickable" {{selected}}>
                <span class="icon is-small">
                    <i class="fa fa-angle-double-right"></i>
                </span>
                {{label}}
            </p>`);
        }

        cleanUp() {
            super.cleanUp()
            removeFromArray(SelectableTreeLabel.labels, [this])
        }
    }
}
