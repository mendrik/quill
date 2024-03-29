module feather.ui {

    import Construct     = feather.annotations.Construct
    import Template      = feather.annotations.Template
    import Bind          = feather.observe.Bind
    import On            = feather.event.On
    import Subscribe     = feather.hub.Subscribe
    import TreeNode      = feather.ui.tree.TreeNode
    import GestureWidget = feather.ui.events.GestureWidget


    @Construct({selector: 'tree-actions'})
    export class TreeActions extends GestureWidget {

        @Bind() disabled = true

        init() {
            this.render()
        }

        @Subscribe('defocus-other-nodes')
        nodeSelected(node: TreeNode<any>) {
            this.disabled = typeof node === 'undefined'
        }

        @On({event: 'tap', selector: 'a[action]:not([disabled])'})
        buttonClicked(ev, el) {
            this.triggerUp('node-action', el.getAttribute('action'))
        }

        @Template()
        markup() {
            return `
            <div class="level is-mobile is-marginless tree-actions">
              <div class="level-left">
                 <a class="button is-small tooltip"
                    action="node-add"
                    tooltip="ui.tooltip.tree-actions.add">
                    <Icon name="plus" icon-class="is-small"/>
                 </a>
                 <a class="button is-small tooltip"
                    action="node-edit"
                    tooltip="ui.tooltip.tree-actions.rename" {{disabled}}>
                    <Icon name="pencil" icon-class="is-small"/>
                 </a>
                 <a class="button is-small tooltip"
                    action="node-configure"
                    tooltip="ui.tooltip.tree-actions.configure" {{disabled}}>
                    <Icon name="cog" icon-class="is-small"/>
                 </a>
              </div>
              <div class="level-right">
                 <a class="button is-small tooltip"
                    action="node-delete"
                    tooltip="ui.tooltip.tree-actions.delete" {{disabled}}>
                    <Icon name="trash-o" icon-class="is-small"/>
                 </a>
              </div>
            </div>`
        }

    }
}
