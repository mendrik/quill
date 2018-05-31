import {h} from 'preact'
import {QuillComponent, Route, View} from 'preact-quill'
import './application.pcss'

@View
export class Application extends QuillComponent {

    @Route('/')
    mainPage() {
        return import('../pages/main-page')
    }

}
