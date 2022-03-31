import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccountController {
    public genders = {
        1: {
            id: 1,
            name: "Masculino"
        },
        2: {
            id: 2,
            name: "Feminino"
        },
        3: {
            id: 3,
            name: "Outro"
        }
    }

    public campus = {
        1: {
            id: 1,
            name: "Seropédica"
        },
        2: {
            id: 2,
            name: "IM - Instituto Multidisciplinar"
        },
        3: {
            id: 3,
            name: "ITR - Três Rios"
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
