module quill {

    import Widget       = feather.core.Widget
    import Construct    = feather.annotations.Construct
    import Template     = feather.annotations.Template
    import Bind         = feather.observe.Bind
    import Route        = feather.routing.Route
    import Subscribe    = feather.hub.Subscribe
    import Rest         = feather.xhr.Rest
    import ToastManager = feather.ui.toast.ToastManager
    import Toast        = feather.ui.toast.Toast
    import Theme        = feather.ui.toast.Theme
    import TypedMap     = feather.types.TypedMap
    import setDeepValue = feather.objects.setDeepValue;

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
        @Bind({bequeath: true}) user: User = null

        translations: TypedMap<any> = {}

        init() {
            this.fetchTranslations()
        }

        @Rest({url: '/translations', headers: quill.headers})
        fetchTranslations(translations?: Messages) {
            translations.messages
                .forEach(c =>
                    setDeepValue(this.translations, c.key, c.value))
            this.render()
        }

        @Rest({url: '/account', headers: quill.headers})
        checkLogin(resp?: User|ApiError) {
            this.user = resp as User
            this.route(`/project/${this.user.lastProject}`)
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

        @Route('/404')
        notFoundPage() {
            this.pages.splice(0, 1, new NotFoundPage())
        }

        @Route('/changepassword')
        changePasswordPage() {
            this.pages.splice(0, 1, new PassordChangePage())
        }

        @Route('/')
        homePage() {
            this.checkLogin()
        }

        @Template()
        applicationHTML() {
            return `<progress-bar></progress-bar>
                    <panel class="fullscreen v-flex" {{pages}}></panel>
                    <localization translations={translations}/>
            `
        }
    }
}
