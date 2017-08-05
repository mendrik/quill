module quill {

    import Widget    = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Bind      = feather.observe.Bind
    import Template  = feather.annotations.Template

    @Construct({selector: 'progress-bar'})
    export class Progress extends Widget {

        static instance: Progress;

        @Bind() fetching = false

        constructor() {
            super()
            Progress.instance = this
        }

        init() {
            this.render()
        }

        @Template()
        markup() {
            return '<div class="progress-runner {{fetching:runningClass}}"></div>'
        }

        static start() {
            Progress.instance.fetching = true
        }

        static stop() {
            Progress.instance.fetching = false
        }

        runningClass = (running: boolean) => running ? 'running' : undefined
    }
}
