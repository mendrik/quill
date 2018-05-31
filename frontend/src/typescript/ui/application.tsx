import {h} from 'preact'
import {Get, QuillComponent, Route, View, router} from 'preact-quill'
import './application.pcss'
import {header} from '../rest/header'
import {User} from '../model/domain'

@View
export class Application extends QuillComponent {

    @Get('/account', {headers: header()})
    fetchUser: () => Promise<User>

    checkUser = async () => {
        try {
            const user = await this.fetchUser()
            router.navigate(`/project/${user.lastProject}`)
        } catch (e) {
        }
    }

    @Route('/')
    async mainPage() {

        return import('../pages/main-page')
    }

}
