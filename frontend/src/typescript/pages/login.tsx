import {h} from 'preact'
import {View, QuillComponent, Form, WithLabel, InputText} from 'preact-quill'
import './login.pcss'

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
