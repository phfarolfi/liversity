import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccountController {

    public async index({view} : HttpContextContract) {
        return view.render('index')
    }

    public async login({view} : HttpContextContract) {
        return view.render('account/login')
    }

    public async forgotPassword({view} : HttpContextContract) {
        return view.render('account/forgotPassword')
    }

    public async signUp({view} : HttpContextContract) {
        return view.render('account/signUp')
    }

}
