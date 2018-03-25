module quill {

    import Widget    = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template  = feather.annotations.Template
    import Subscribe = feather.hub.Subscribe

    @Construct({selector: 'value-editor', attributes: ['config']})
    export class ValueEditor extends Widget {

        versionValues: VersionValues[] = []

        @Template()
        markup() {
            return `
            <div class="tabs is-boxed">
                <ul {{versionValues}}></ul>
            </div>
            `
        }

        @Subscribe('project-loaded')
        projectLoaded(project: Project) {
            this.versionValues.splice(0, this.versionValues.length,
                ...project.versions.map(version => new VersionValues(version)))
        }
    }
}
