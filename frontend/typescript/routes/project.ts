module quill {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode

    export class ProjectPage extends Widget {

        @Bind() nodes: Array<TreeNode<any>> = []

        projectId: string

        constructor(projectId: string) {
            super()
            this.projectId = projectId
        }

        init() {
            const animals = new TreeNode('Animals', {}),
                cats = new TreeNode('Cats', {}),
                dogs = new TreeNode('Dogs', {}),
                birds = new TreeNode('Birds', {}),
                fish = new TreeNode('Fish', {})

            const lion = new TreeNode('Lion', {}),
                tiger = new TreeNode('Tiger', {}),
                cheetah = new TreeNode('Cheetah', {}),
                leopard = new TreeNode('Leopard', {})

            const cars = new TreeNode('Cars', {}),
                merc = new TreeNode('Mercedes', {}),
                bmw = new TreeNode('BMW', {}),
                audi = new TreeNode('Audi', {}),
                porsche = new TreeNode('Porsche', {})

            const p911 = new TreeNode('911', {}),
                p911t = new TreeNode('911 Turbo', {}),
                p911ts = new TreeNode('911 Turbo S', {})

            p911t.push(p911ts)
            p911.push(p911t)
            porsche.push(p911)

            cats.push(lion, tiger, cheetah, leopard)
            animals.push(cats, dogs, birds, fish)
            cars.push(merc, porsche, bmw, audi)
            this.nodes.push(animals, cars)
        }

        @Subscribe('node-selected')
        nodeSelected(node: TreeNode<any>) {
            this.triggerDown('deselect-other-nodes', node)
        }

        @Template()
        projectPage() {
            return (`
              <panel class="fullscreen v-flex">  
                  <navigation class="no-grow"></navigation>
                  <horizontal-split class="grow" id="app-split">
                    <sidebar class="v-flex">
                      <tree-node-actions></tree-node-actions>
                      <scroll-pane class="grow">
                        <aside class="menu">
                          <p class="menu-label">Structure</p>
                          <ul class="tree-view is-marginless" {{nodes}}></ul>
                          <p class="menu-label">Schemas</p>
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
