import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
        
        console.log(email, password)
    
        try {
          await auth.use('web').attempt(email, password)
          response.redirect().toRoute('index')
        } catch {
          session.flashExcept(['login'])
          session.flash({ errors: { login: 'Não encontramos nenhuma conta com essas credenciais.' } })

          return response.redirect().toRoute('AccountController.create')
        }
    }

    public async forgotPassword({view} : HttpContextContract) {
        return view.render('account/ForgotPassword')
    }

    public async signUp({view} : HttpContextContract) {
        return view.render('account/SignUp')
    }

    public async createUser({request, response} : HttpContextContract) {
        const { email, password } = request.all()
        console.log(email + password);
        return response.redirect().toRoute('login.create')
    }

    /* public async editProfile({view} : HttpContextContract) {
        return view.render('account/EditProfile', { genders : this.genders, campus : this.campus })
    } */
}
