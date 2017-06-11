module feather.ui {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode

    @Construct({selector: 'tree-actions'})
    export class TreeActions extends Widget {

        @Bind() disabled = true

        init() {
            this.render()
        }

        @Subscribe('deselect-other-nodes')
        nodeSelected(node: TreeNode<any>) {
            this.disabled = false
        }

        @Template()
        markup() {
            return (`
              <div class="level is-mobile is-marginless">
                <div class="level-left">
                   <div class="inline toggler">
                      <a class="button is-small"><Icon name="plus"></Icon></a>
                      <div class="block form-components create-node toggle open-in-view">
                         <Text label="Name"></Text>
                         <div class="block has-text-right">
                            <a class="button">Cancel</a>
                            <a class="button is-primary">Create</a>
                         </div>
                      </div>
                   </div>
                   <a class="button is-small" {{disabled}}><Icon name="lock"/></a>
                   <a class="button is-small" {{disabled}}><Icon name="cut"/></a>
                   <a class="button is-small" {{disabled}}><Icon name="paste"/></a>
                </div>
                <div class="level-right">
                   <a class="button is-small" {{disabled}}><Icon name="trash-o"/></a>
                </div>
              </div>
            `)
        }

    }
}
