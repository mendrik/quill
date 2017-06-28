module quill {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode
    import Rest = feather.xhr.Rest

    export class ProjectPage extends Widget {

        @Bind() nodes: Array<TreeNode<any>> = []

        projectId: string
        currentTreeNode: TreeNode<Node>

        constructor(projectId: string) {
            super()
            this.projectId = projectId
        }

        init() {
            this.fetchProject()
        }

        @Rest({url: '/projects/{{projectId}}', headers: quill.headers})
        fetchProject(project?: Project) {
            console.log(project)
        }

        @Subscribe('node-defocused')
        nodeDeselected(node: TreeNode<any>) {
            this.currentTreeNode = undefined
        }

        @Subscribe('node-focused')
        nodeSelected(node: TreeNode<any>) {
            this.currentTreeNode = node
            this.triggerDown('defocus-other-nodes', node)
        }

        @Subscribe('node-action')
        nodeAction(action: string) {
            console.log(action)
        }

        @Template()
        projectPage() {
            return (`
              <panel class="fullscreen v-flex">  
                  <navigation class="no-grow"></navigation>
                  <horizontal-split class="grow" id="app-split">
                    <sidebar class="v-flex">
                      <tree-actions></tree-actions>
                      <scroll-pane class="grow">
                        <aside class="menu">
                          <selectable-tree-label label="Structure" selected={true}></selectable-tree-label>
                          <ul class="tree-view is-marginless" {{nodes}}></ul>
                          <selectable-tree-label label="Schemas" selected={false}></selectable-tree-label>
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
            `)
        }
    }
}
