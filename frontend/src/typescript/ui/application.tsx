import {h} from 'preact'
import {header} from '../rest/header'
import {User} from '../model/domain'
import './application.pcss'
import {View} from 'preact-quill/cjs/decorators/view'
import {QuillComponent} from 'preact-quill/cjs/util/quill-component'
import {FetchFailure, Get} from 'preact-quill/cjs/decorators/fetch'
import {navigate, Route} from 'preact-quill/cjs/decorators/router'

@View
export class Application extends QuillComponent {

    @Get('/account', {headers: header()})
    fetchUser: () => Promise<User>

    checkUser = async () => {
        const user = await this.fetchUser()
        if (user) {
            navigate(`/project/${user.lastProject}`)
        }
    }

    @FetchFailure(401)
    unauthorized() {
        navigate(`/login`)
    }

    @Route('/')
    async mainPage() {
        await this.checkUser()
    }

    @Route('/login')
    async loginPage() {
        return import('../pages/login')
    }

}
