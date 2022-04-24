import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Campus from 'App/Models/Campus'
import Category from 'App/Models/Category'
import Gender from 'App/Models/Gender'
import Interest from 'App/Models/Interest'
import Student from 'App/Models/Student'
import User from 'App/Models/User'
export default class AccountController {
    public async loginView({ auth, response, view } : HttpContextContract) {
        await auth.use('web').check()
        if(auth.use('web').isLoggedIn)
            return response.redirect().toRoute('index')

        return view.render('account/login')
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

        return view.render('account/signUp')
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

        var userAlreadyExist = await User.findBy('email', email);
        if(userAlreadyExist != null) {
            session.flashExcept(['signUp'])
            session.flash({ errors: { signUp: 'Já existe uma conta associada ao e-mail inserido' } })
            return response.redirect().toRoute('AccountController.signUpView')
        }
        try {
            //profileId == 1 (admin) and profileId == 2 (student)
            var userCreated = await User.create({ name: name, email: email, password: password, profileId: 2, completedProfile: false });
            await Student.create({ userId: userCreated.id })
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

        return view.render('account/forgotPassword')
    }

    public async updateProfile({request, response, session, auth} : HttpContextContract) {
        const profile = request.all();

        if(!profile.name || !profile.birthDate || !profile.genderId || !profile.cpf ||
            !profile.email || !profile.campusId || !profile.photo) {
            session.flashExcept(['editProfile'])
            session.flash({ errors: { editProfile: 'Preencha todos os campos solicitados' } })
            return response.redirect().toRoute('AccountController.userProfileView')
        }

        if(auth.user!.profileId == 2) {
            if(!profile.numberEnrollment || !profile.course || !profile.extracurricularActivities) {
                session.flashExcept(['editProfile'])
                session.flash({ errors: { editProfile: 'Preencha todos os campos solicitados' } })
                return response.redirect().toRoute('AccountController.userProfileView')
            }
        }

        var user = await User.findBy('email', profile.email)
        if(user) {
            user.name = profile.name
            user.completedProfile = true
            user.birthDate = profile.birthDate
            user.genderId = profile.genderId
            user.cpf = profile.cpf
            user.campusId = profile.campusId
            user.photo = profile.photo
            await user.save()
        }

        if(auth.user!.profileId == 2) {
            var studentProfile = await Student.findBy('userId', auth.user!.id)
            if(studentProfile) {
                studentProfile.numberEnrollment = profile.numberEnrollment
                studentProfile.course = profile.course
                studentProfile.extracurricularActivities = profile.extracurricularActivities
                await studentProfile.save()
            }
        }

        await Interest.query().where('user_id', user!.id).delete()        
        for(let interest of profile.interests) {
            await Interest.create({ userId: user!.id, categoryId: interest });
        }

        return response.redirect().toRoute('userProfile.view')
    }

    public async userProfileView({auth, view} : HttpContextContract) {
        var nullPhoto = 'https://liversity-app.s3.amazonaws.com/students/photo/default-profile.jpg'
        var genders = await Gender.query().orderBy('name', 'asc')
        var campuses = await Campus.query().orderBy('name', 'asc')
        var categories = await Category.query().orderBy('id', 'asc')
        var user = await User.findBy('email', auth.user!.email)
        var student = await Student.findBy('userId', user!.id)
        var studentGender = await Gender.findBy('id', user!.genderId)
        var studentCampus = await Campus.findBy('id', user!.campusId)
        var birthDateFormatted = ''
        if(user!.birthDate != null) {
            const offset = user!.birthDate.getTimezoneOffset()
            var birthDate = new Date(user!.birthDate.getTime() - (offset*60*1000))
            birthDateFormatted = birthDate.toISOString().split('T')[0]
        }
        var interests = await Database
        .from('interests')
        .join('categories', (query) => {
          query.on('interests.category_id', '=', 'categories.id')
        })
        .whereRaw('interests.user_id = ?', [user!.id])
        .select('categories.id')
        .select('categories.name')

        var interestsIdSelected = interests.map((interest) => interest.id)

        if(!user?.completedProfile)
            return view.render('account/profilePage', { genders: genders, campuses: campuses, categories: categories, user: user, nullPhoto: nullPhoto, interests : interests, interestsIdSelected: interestsIdSelected })
        else
            return view.render('account/profilePage', { genders: genders, campuses: campuses, categories: categories, user: user, student: student?.$attributes, birthDate : birthDateFormatted,
                                                        studentGender: studentGender?.name, studentCampus: studentCampus?.name, nullPhoto: nullPhoto, interests : interests,
                                                        interestsIdSelected: interestsIdSelected })
    }

    public async createAdminView({auth, view} : HttpContextContract) {
        if(auth.user!.profileId == 1) {
            return view.render('account/createAdmin', {completedProfile : auth.user!.completedProfile})
        }
        else {
            return view.render('errors/unauthorized')
        }
    }
}
