module quill {

    import FormComponent = feather.ui.types.FormComponent
    import FormField     = feather.ui.types.FormFieldConfig
    import Bind          = feather.observe.Bind
    import Template      = feather.annotations.Template
    import Construct     = feather.annotations.Construct

    export interface Radio<T> {
        key: string
        value: T
    }

    export interface RadioSetConfig<T> extends FormField<T> {
        radios: Radio<T>[]
        selected: T
    }

    @Construct({selector: 'RadioSet'})
    export class RadioSet<T> extends FormComponent<RadioSetConfig<T>> {

        @Bind() radios: RadioWidget<T>[] = []

        constructor(config: RadioSetConfig<T>) {
            super(config)
            const radioWidgets = config.radios.map(rc => new RadioWidget<T>({
                label: rc.key,
                name: config.name,
                checked: rc.value === config.selected,
                onChange: (value: T) => config.onChange(value)
            }))
            this.radios.splice(0, this.radios.length, ...radioWidgets)
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
