import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Campus from 'App/Models/Campus'
import Gender from 'App/Models/Gender'
import Student from 'App/Models/Student'
import User from 'App/Models/User'

export default class AccountController {
    public async loginView({ auth, response, view } : HttpContextContract) {
        await auth.use('web').check()
        if(auth.use('web').isLoggedIn)
            return response.redirect().toRoute('index')

        return view.render('account/Login')
    }

    public async authenticate({ auth, request, response, session } : HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')

        if(!email || !password) {
            session.flashExcept(['login'])
            session.flash({ errors: { login: 'Preencha os campos de e-mail e senha' } })
            return response.redirect().toRoute('AccountController.loginView')
        }

        try {
          await auth.use('web').attempt(email, password)
          await auth.use('web').authenticate()
          response.redirect().toRoute('index')
        } catch {
          session.flashExcept(['login'])
          session.flash({ errors: { login: 'Dados incorretos' } })

          return response.redirect().toRoute('AccountController.loginView')
        }
    }

    public async logout({auth, response} : HttpContextContract) {
        await auth.use('web').logout()
        response.redirect().toRoute('AccountController.loginView')
    }

    public async signUpView({ auth, response, view } : HttpContextContract) {
        await auth.use('web').check()
        if(auth.use('web').isLoggedIn)
            return response.redirect().toRoute('index')

        return view.render('account/SignUp')
    }

    public async createUser({request, response, session} : HttpContextContract) {
        const { name, email, password } = request.all()

        if(!name || !email || !password) {
            session.flashExcept(['signUp'])
            session.flash({ errors: { signUp: 'Preencha todos os campos solicitados' } })
            return response.redirect().toRoute('AccountController.signUpView')
        }

        if(password.length < 8) {
            session.flashExcept(['signUp'])
            session.flash({ errors: { signUp: 'A senha deve ser composta por no mínimo 8 caracteres' } })
            return response.redirect().toRoute('AccountController.signUpView')
        }

        var userAlreadyExist = await User.findByOrFail('email', email);
        if(userAlreadyExist != null) {
            session.flashExcept(['signUp'])
            session.flash({ errors: { signUp: 'Já existe uma conta associada ao e-mail inserido' } })
            return response.redirect().toRoute('AccountController.signUpView')
        }

        try {
            //profileId == 1 (admin) and profileId == 2 (student)
            var userCreated = await User.create({ name: name, email: email, password: password, profileId: 2});
            await Student.create({ userId: userCreated.id, completedProfile: false })
            response.redirect().toRoute('login.view')
        } catch {
            session.flashExcept(['signUp'])
            session.flash({ errors: { signUp: 'Não foi possível realizar o cadastro.' } })

            return response.redirect().toRoute('AccountController.signUpView')
        }
    }

    public async forgotPasswordView({ auth, response, view } : HttpContextContract) {
        await auth.use('web').check()
        if(auth.use('web').isLoggedIn)
            return response.redirect().toRoute('index')

        return view.render('account/ForgotPassword')
    }

    public async editProfileView({auth, response, view } : HttpContextContract) {
        await auth.use('web').check()
        if(!auth.use('web').isLoggedIn)
            return response.redirect().toRoute('login.view')

        var genders = await Gender.query().orderBy('name', 'asc')
        var campuses = await Campus.query().orderBy('name', 'asc')
        var user = await User.findByOrFail('email', auth.user!.email)
        var student = await Student.findByOrFail('userId', user.id)
        if(!student.completedProfile)
            return view.render('account/EditProfile', { genders: genders, campuses: campuses, user: user })
        else
            return view.render('account/EditProfile', { genders: genders, campuses: campuses, user: user, student: student })
    }

    public async updateProfile({request, response, session} : HttpContextContract) {
        const profile = request.all();
        console.log(profile)
        if(!profile.name || !profile.birthDate || !profile.genderId || !profile.cpf ||
            !profile.email || !profile.numberEnrollment || !profile.course ||
            !profile.campusId || !profile.extracurricularActivities) {
            session.flashExcept(['editProfile'])
            session.flash({ errors: { editProfile: 'Preencha todos os campos solicitados' } })
            return response.redirect().toRoute('AccountController.editProfileView')
        }
        //alterar depois para o upload de foto pela tela
        profile.photo = "s3://liversity-app/students/photo/allef-vinicius-BqNEe_ZAtxg-unsplash.jpg";
        var studentUser = await User.findByOrFail('email', profile.email)
        if(studentUser) {
            studentUser.name = profile.name
            await studentUser.save()
        }

        var studentProfile = await Student.findByOrFail('userId', studentUser.id)
        if(studentProfile) {
            studentProfile.completedProfile = true
            studentProfile.birthDate = profile.birthDate
            studentProfile.genderId = profile.genderId
            studentProfile.cpf = profile.cpf
            studentProfile.numberEnrollment = profile.numberEnrollment
            studentProfile.course = profile.course
            studentProfile.campusId = profile.campusId
            studentProfile.extracurricularActivities = profile.extracurricularActivities
            studentProfile.photo = profile.photo
            await studentProfile.save()
        }

        return response.redirect().toRoute('editProfile.view')
    }

    public user = {
        photo: "images/users/mike.jpg", 
        name: "Fulano D. Tal", 
        course: "Ciência da Computação", 
        campus: "Nova Iguaçu - IM", 
        certificatesNumber: 32, 
        eventsCreated: 11
    }
    public async showProfile({view} : HttpContextContract) {
        return view.render('account/ProfilePage', { user: this.user })
    }
}
