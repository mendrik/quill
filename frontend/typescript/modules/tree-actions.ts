module feather.ui {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode
    import NodeType = quill.NodeType
    import NodeTypeType = quill.NodeTypeType;

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

    const typeConverter = (c: NodeType) => new ChooserValue<NodeType>(textFor(c.name), iconFor(c.name), c)

    @Construct({selector: 'tree-actions'})
    export class TreeActions extends Widget {

        @Bind() disabled = true

        dropdownConfig: DropdownConfig<NodeType> = {
            values: [
                {name: 'string'},
                {name: 'number'},
                {name: 'enum'},
                {name: 'list'},
                {name: 'node'},
                {name: 'boolean'}
            ].map(typeConverter),
            dataConverter: typeConverter
        }

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
                         <Dropdown label="Type of node" config={dropdownConfig}/>
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
