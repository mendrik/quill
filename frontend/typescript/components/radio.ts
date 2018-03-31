module quill {

    import On            = feather.event.On
    import Bind          = feather.observe.Bind
    import Template      = feather.annotations.Template
    import FormField     = feather.ui.types.FormFieldConfig
    import FormComponent = feather.ui.types.FormComponent

    export interface RadioConfig<T> extends FormField<T> {
        checked: boolean
    }

    export class RadioWidget<T> extends FormComponent<RadioConfig<T>> {

        input: HTMLInputElement
        @Bind() label: string
        @Bind() checked: boolean

        constructor(config: RadioConfig<T>) {
            super(config)
            this.checked = config.checked
        }

        @On({event: 'change', selector: 'label + label'})
        clicked() {
            this.checked = this.input.checked
        //    this.config.onChange(this.checked)
        }

        init(element: HTMLElement) {
            this.render()
            this.input = element.querySelector('input')
        }

        @Template()
        markup() {
            return `
            <div class="field">
               <input class="is-checkradio has-no-border"
                      type="radio"
                      {{config.checked}}>
               <label for="multiline-normal">
                  {{config.label:translate}}
               </label>
            </div>`
        }
    }
}
