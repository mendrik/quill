module feather.ui {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import On = feather.event.On
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode
    import NodeType = quill.NodeType
    import GestureWidget = feather.ui.events.GestureWidget;

/*
    const iconFor = (key: NodeTypeType): string => {
        switch (key) {
            case 'string': return 'font';
            case 'number': return 'table';
            case 'enum': return 'ellipsis-v';
            case 'list': return 'database';
            case 'node': return 'sitemap';
            case 'boolean': return 'toggle-on';
        }
    }

    const textFor = (key: NodeTypeType): string => {
        switch (key) {
            case 'string': return 'Text';
            case 'number': return 'Number';
            case 'enum': return 'Enumeration';
            case 'list': return 'List';
            case 'node': return 'Node';
            case 'boolean': return 'Toggle';
        }
    }
*/

    // const typeConverter = (c: NodeType) => new ChooserValue<NodeType>(textFor(c.name), iconFor(c.name), c)

    @Construct({selector: 'tree-actions'})
    export class TreeActions extends GestureWidget {

        @Bind() disabled = true

        init() {
            this.render()
        }

        @Subscribe('defocus-other-nodes')
        nodeSelected(node: TreeNode<any>) {
            this.disabled = false
        }

        @On({event: 'tap', selector: 'a[action]:not([disabled])'})
        buttonClicked(ev, el) {
            this.triggerUp('node-action', el.getAttribute('action'))
        }

        @Template()
        markup() {
            return (`
              <div class="level is-mobile is-marginless">
                <div class="level-left">
                   <a class="button is-small" action="node-add"><Icon name="plus"></Icon></a>
                </div>
                <div class="level-right">
                   <a class="button is-small" action="node-delete" {{disabled}}><Icon name="trash-o"/></a>
                </div>
              </div>
            `)
        }

    }
}
