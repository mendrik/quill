module quill {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Route = feather.routing.Route
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode
    import Rest = feather.xhr.Rest

    @Construct({selector: 'body.quill-app'})
    export class QuillApplication extends Widget {

        @Bind() pages: Array<Widget> = []

        init() {
            this.render()
            this.checkLogin()
        }

        @Rest({url: '/whoami'})
        checkLogin(user?: User) {
            this.route("/project")
        }

        @Subscribe('xhr-failure')
        loginFailed(err: string, xhr: XMLHttpRequest) {
            this.route("/project/1")
        }

        @Route('/project/:id')
        projectPage(params: IdParam) {
            this.pages.splice(0, 1, new ProjectPage(params.id))
        }

        @Route('/login')
        loginPage() {
            this.pages.splice(0, 1, new LoginPage())
        }

        @Template()
        applicationHTML() {
            return (`<panel class="fullscreen v-flex" {{pages}}></panel>`)
        }
    }
}
