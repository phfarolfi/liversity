import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

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

    public async login({view, response} : HttpContextContract) {
        return view.render('account/Login')
        
        // return response.redirect().toRoute('index') 
    }
    
    public async forgotPassword({view} : HttpContextContract) {
        return view.render('account/ForgotPassword')
    }

    public async signUp({view} : HttpContextContract) {
        return view.render('account/SignUp')
    }

    public async createUser({request, response, session} : HttpContextContract) {
        const { name, email, password } = request.all()
        console.log(name + email + password);

        try {
            //profileId == 1 (admin) and profileId == 2 (student)
            await User.create({ name: name, email: email, password: password, profileId: 2});
            response.redirect().toRoute('login.create')
        } catch {
            session.flashExcept(['signUp'])
            session.flash({ errors: { signUp: 'Não foi possível realizar o cadastro.' } })

            return response.redirect().toRoute('AccountController.signUp')
        }
    }

    public async editProfile({view} : HttpContextContract) {
        return view.render('account/EditProfile', { genders : this.genders, campus : this.campus })
    }
}
