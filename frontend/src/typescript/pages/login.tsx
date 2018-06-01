import {h} from 'preact'
import './login.pcss'
import {View} from 'preact-quill/cjs/decorators/view'
import {QuillComponent} from 'preact-quill/cjs/util/quill-component'
import {Form} from 'preact-quill/cjs/components/forms/form'
import {WithLabel} from 'preact-quill/cjs/components/forms/with-label'
import {InputText} from 'preact-quill/cjs/components/input-text/input-text'

@View
export class Login extends QuillComponent {
    render() {
        return (
            <div class="card login">
                <Form>
                    <WithLabel name="E-Mail">
                        <InputText changes={() => 0} iconLeft="account"/>
                    </WithLabel>
                    <WithLabel name="Password">
                        <InputText changes={() => 0} iconLeft="key"/>
                    </WithLabel>
                </Form>
                <div class="buttons is-pulled-right">
                    <button class="button is-primary" data-locale="ui.signin.button"/>
                </div>
            </div>
        )
    }
}
