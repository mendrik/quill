module quill {

    import Construct  = feather.annotations.Construct
    import ScrollPane = feather.ui.ScrollPane

    @Construct({selector: 'scroll-receiver'})
    export class ScrollReceiver extends ScrollPane {

        constructor() {
            super()
        }

        init(el: Element) {
            this.triggerSingleton('register-scroll-receiver', this)
        }

        scrollTo(y: number) {
            console.log(this.element)
            this.element.scrollTop = y
        }

    }
}
