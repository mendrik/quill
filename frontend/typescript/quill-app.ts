module quill {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Route = feather.routing.Route
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode
    import Rest = feather.xhr.Rest
    import ToastManager = feather.ui.toast.ToastManager
    import Toast = feather.ui.toast.Toast
    import Theme = feather.ui.toast.Theme

    export interface Messages {
        messages: Message[]
    }

    export interface Message {
        key: string,
        value: string
    }

    @Construct({selector: 'body.quill-app'})
    export class QuillApplication extends Widget {

        @Bind() pages: Array<Widget> = []
        user: User

        init() {
            this.fetchTranslations()
        }

        @Rest({url: '/translations', headers: quill.headers})
        fetchTranslations(translations?: Messages) {
            quill.components.Translate.translations = translations.messages.reduce((p, c) => ({...p, [c.key]: c.value}), {})
            this.render()
        }

        @Rest({url: '/account', headers: quill.headers})
        checkLogin(resp?: User|ApiError) {
            this.user = resp as User
            this.route(`/project/1`)
        }

        @Subscribe('xhr-failure-401')
        unauthorized() {
            this.route('/login')
        }

        genericFetchError(err: string, xhr: XMLHttpRequest) {
            ToastManager.showToast(new Toast('API request has failed', err, Theme.Error))
        }

        @Route('/project/:id')
        projectPage(params: IdParam) {
            if (!this.user) {
                this.checkLogin()
            } else {
                this.pages.splice(0, 1, new ProjectPage(params.id))
            }
        }

        @Route('/login')
        loginPage() {
            this.pages.splice(0, 1, new LoginPage())
        }

        @Route('/')
        homePage() {
            this.checkLogin()
        }

        @Template()
        applicationHTML() {
            return (`<progress-bar></progress-bar><panel class="fullscreen v-flex" {{pages}}></panel>`)
        }
    }
}
