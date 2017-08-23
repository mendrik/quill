module quill {

    import Widget    = feather.core.Widget
    import Template  = feather.annotations.Template
    import Bind      = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import TreeNode  = feather.ui.tree.TreeNode
    import Rest      = feather.xhr.Rest
    import Method    = feather.xhr.Method

    class CustomTreeNode extends TreeNode<Node> {
        id = () => `${this.value.id}`
    }

    const toTreeNode = (n: Node) => {
        const tn = new CustomTreeNode(n.name, n, quill.iconFor(n.type))
        tn.children.push(...n.children.map(toTreeNode))
        return tn;
    }

    const dummyProject: Project = {
        id: 0,
        name: '',
        structure: [],
        schema: []
    }

    export class ProjectPage extends Widget {

        @Bind() nodes: Array<CustomTreeNode> = []
        @Bind() schemaNodes: Array<CustomTreeNode> = []
        @Bind({bequeath: true}) project: Project = dummyProject

        projectId: string
        currentTreeNode: CustomTreeNode
        currentRootType: NodeRoot = 'structure'
        id = () => this.projectId

        newNode: NewNode = {
            name: 'New node',
            sort: 0
        }

        constructor(projectId: string) {
            super()
            this.projectId = projectId
        }

        init() {
            this.fetchProject()
        }

        @Rest({url: '/projects/{{projectId}}', headers: quill.headers})
        fetchProject(project?: Project) {
            this.project = project
            this.nodes.push(...project.structure.map(toTreeNode))
        }

        @Subscribe('node-defocused')
        nodeDeselected(node: CustomTreeNode) {
            this.currentTreeNode = undefined
        }

        @Subscribe('node-focused')
        nodeSelected(node: CustomTreeNode) {
            this.currentTreeNode = node
            this.triggerDown('defocus-other-nodes', node)
        }

        @Subscribe('root-type-selected')
        rootTypeSelected(type: NodeRoot) {
            this.currentRootType = type
            this.triggerDown('defocus-other-nodes')
        }

        @Subscribe('node-action')
        nodeAction(action: string) {
            switch (action) {
                case 'node-add': {
                    if (this.currentTreeNode) {
                        this.createChildNode()
                    } else {
                        this.createNode()
                    }
                    break;
                }
                case 'node-delete': {
                    this.deleteNode()
                    break;
                }
            }
        }

        @Rest({url: '/projects/{{projectId}}/node/{{currentNode.id}}', method: Method.POST, headers: quill.headers})
        createChildNode() {

        }

        @Rest({url: '/projects/{{projectId}}/node/{{currentNode.id}}', method: Method.DELETE, headers: quill.headers})
        deleteNode() {

        }

        @Rest({url: '/projects/{{projectId}}/{{currentRootType}}', method: Method.POST, body: 'newNode', headers: quill.headers})
        createNode() {

        }

        @Template()
        projectPage() {
            return `
              <panel class="fullscreen v-flex">  
                  <navigation class="no-grow"></navigation>
                  <horizontal-split class="grow" id="app-split">
                    <sidebar class="v-flex">
                      <tree-actions></tree-actions>
                      <scroll-pane class="grow">
                        <aside class="menu">
                          <selectable-tree-label label="Structure" selected={true} type="structure"></selectable-tree-label>
                          <ul class="tree-view is-marginless" {{nodes}}></ul>
                          <selectable-tree-label label="Schemas" selected={false} type="schema"></selectable-tree-label>
                          <ul class="tree-view is-marginless" {{schemaNodes}}></ul>
                        </aside>
                      </scroll-pane>
                    </sidebar>
                    <section class="v-flex">
                      <scroll-pane class="grow">
                      </scroll-pane>
                    </section>
                  </horizontal-split>
                  <footer class="no-grow"/>
              </panel>
            `
        }
    }
}
