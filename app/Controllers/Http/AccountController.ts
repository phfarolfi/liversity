import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccountController {

    public generos = {
        1: {
            id: 1,
            nome: "Masculino"
        },
        2: {
            id: 2,
            nome: "Feminino"
        },
        3: {
            id: 3,
            nome: "Outro"
        }
    }

    public campi = {
        1: {
            id: 1,
            nome: "Seropédica"
        },
        2: {
            id: 2,
            nome: "IM - Instituto Multidisciplinar"
        },
        3: {
            id: 3,
            nome: "ITR - Três Rios"
        }
    }

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

    public async editProfile({view} : HttpContextContract) {
        return view.render('account/editProfile', { generos : this.generos, campi : this.campi })
    }

}
