module quill.modal {

    import Template  = feather.annotations.Template

    export class ProjectConfig extends ModalWidget {

        project: Project

        constructor(project: Project) {
            super()
            this.project = project
        }

        getTitle () {
            return 'ui.modal.project-config.title'
        }

        @Template()
        markup() {
            return `<div class="">Project Config</div>`
        }
    }
}
