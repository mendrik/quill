import {h} from 'preact'
import {Get, QuillComponent, Route, View, navigate, FetchFailure} from 'preact-quill'
import {header} from '../rest/header'
import {User} from '../model/domain'
import './application.pcss'

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
