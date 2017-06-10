module quill {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Route = feather.routing.Route
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode
    import Rest = feather.xhr.Rest
    import TypedMap = feather.types.TypedMap
    import StringFactory = feather.xhr.StringFactory

    @Construct({selector: 'body.quill-app'})
    export class QuillApplication extends Widget {

        static Headers: TypedMap<string|StringFactory>  = {
            'X-Api-Key': undefined
        }

        @Bind() pages: Array<Widget> = []
        user: User

        init() {
            this.render()
            this.checkLogin()
        }

        @Rest({url: '/account', headers: QuillApplication.Headers})
        checkLogin(resp?: User|ApiError) {
            let code = (resp as ApiError).code;
            if (code) {
                this.route('/login')
            } else {
                this.user = resp as User
                this.route('/project')
            }
        }

        @Subscribe('xhr-failure')
        xhrFailure(err: string, xhr: XMLHttpRequest) {
            if (xhr.status === 401) {
                this.route('/login')
            } else {
                this.genericFetchError(err, xhr)
            }
        }

        genericFetchError(err: string, xhr: XMLHttpRequest) {
            // todo
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
