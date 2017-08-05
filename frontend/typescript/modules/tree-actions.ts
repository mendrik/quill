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
                   <a class="button is-small" action="node-edit" {{disabled}}><Icon name="pencil"></Icon></a>
                </div>
                <div class="level-right">
                   <a class="button is-small" action="node-delete" {{disabled}}><Icon name="trash-o"/></a>
                </div>
              </div>
            `)
        }

    }
}
