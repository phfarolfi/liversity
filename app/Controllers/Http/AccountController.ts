import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccountController {
    public genders = {
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

    public campus = {
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
        return view.render('account/Login')
    }

    public async forgotPassword({view} : HttpContextContract) {
        return view.render('account/ForgotPassword')
    }

    public async signUp({view} : HttpContextContract) {
        return view.render('account/SignUp')
    }

    public async editProfile({view} : HttpContextContract) {
        return view.render('account/EditProfile', { genders : this.genders, campus : this.campus })
    }
}
