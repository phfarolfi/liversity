import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AccountController {
    public async index({view} : HttpContextContract) {
        return view.render('index')
    }

    public async create({ view } : HttpContextContract) {
        return view.render('account/Login')
    }

    public async store({ auth, request, response, session } : HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')

        try {
          await auth.use('web').attempt(email, password)
          response.redirect().toRoute('index')
        } catch {
          session.flashExcept(['login'])
          session.flash({ errors: { login: 'Dados incorretos.' } })

          return response.redirect().toRoute('AccountController.create')
        }
    }
    
    public async forgotPassword({view} : HttpContextContract) {
        return view.render('account/ForgotPassword')
    }

    public async signUp({view} : HttpContextContract) {
        return view.render('account/SignUp')
    }

    public async createUser({request, response, session} : HttpContextContract) {
        const { name, email, password } = request.all()

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

    public user = {
        photo: "images/users/estudante.jpg", 
        name: "Fulano D. Tal", 
        course: "Ciência da Computação", 
        campus: "Nova Iguaçu - IM", 
        certificatesNumber: 32, 
        eventsCreated: 11
    }
    public async showProfile({view} : HttpContextContract) {
        return view.render('account/ProfilePage', { user: this.user })
    }

    public async editProfile({view} : HttpContextContract) {
        return view.render('account/EditProfile', { genders : this.genders, campus : this.campus })
    }
}
