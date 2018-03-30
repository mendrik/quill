module quill {

    import FormComponent = feather.ui.types.FormComponent
    import FormField     = feather.ui.types.FormFieldConfig
    import Bind          = feather.observe.Bind
    import Template      = feather.annotations.Template

    export interface RadiosetConfig extends FormField<Radio[]> {
    }

    export class RadioSet extends FormComponent<RadiosetConfig> {

        @Bind() radios: Radio[] = []

        constructor(config: RadiosetConfig) {
            super(config)
        }

        init(element: HTMLElement) {
            this.render()
        }

        @Template()
        markup() {
            return `<div {{radios}}/>`
        }
    }
}
