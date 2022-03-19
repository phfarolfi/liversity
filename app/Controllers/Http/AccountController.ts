import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccountController {
    public async login({view} : HttpContextContract) {
        return view.render('login')
    }
}
