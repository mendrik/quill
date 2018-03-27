module quill {

    import Widget    = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template  = feather.annotations.Template
    import Subscribe = feather.hub.Subscribe
    import Bind      = feather.observe.Bind

    @Construct({selector: 'value-editor'})
    export class ValueEditor extends Widget {

        @Bind({}) versionValues: VersionValues[] = []

        init(el: Element) {
            this.render()
        }

        @Template()
        markup() {
            return `<ul class="grow" {{versionValues}}></ul>`
        }

        @Subscribe('project-loaded')
        projectLoaded(project: Project) {
            this.versionValues.splice(0, this.versionValues.length,
                ...project.versions.map(version => new VersionValues(version)))
        }
    }
}
