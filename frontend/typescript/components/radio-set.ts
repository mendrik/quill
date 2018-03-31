module quill {

    import FormComponent = feather.ui.types.FormComponent
    import FormField     = feather.ui.types.FormFieldConfig
    import Bind          = feather.observe.Bind
    import Template      = feather.annotations.Template
    import Construct     = feather.annotations.Construct

    export interface Radio {
        key: string
        value: string
    }

    export interface RadiosetConfig<T> extends FormField<T> {
        radios: Radio[]
        selected: T
    }

    @Construct({selector: 'RadioSet'})
    export class RadioSet<T> extends FormComponent<RadiosetConfig<T>> {

        @Bind() radios: Radio[] = []

        constructor(config: RadiosetConfig<T>) {
            super(config)
            this.radios.splice(0, this.radios.length,
                ...config.radios.map(rc => new RadioWidget({
                    label: rc.key,
                    name: config.name,
                    checked: rc.value === config.selected,
                    value: rc.value,
                    onChange: (value: T) => config.onChange(value)

                } as RadioConfig)))
        }

        init(element: HTMLElement) {
            this.render()
        }

        @Template()
        markup() {
            return `<div class="is-horizontal">
                <div class="field-body" {{radios}}></div>
            </div>`
        }
    }
}
