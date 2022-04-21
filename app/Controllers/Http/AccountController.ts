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

        return view.render('account/forgotPassword')
    }

    public async updateProfile({request, response, session, auth} : HttpContextContract) {
        const profile = request.all();

        if(!profile.name || !profile.birthDate || !profile.genderId || !profile.cpf ||
            !profile.email || !profile.numberEnrollment || !profile.course ||
            !profile.campusId || !profile.extracurricularActivities || !profile.photo) {
            session.flashExcept(['editProfile'])
            session.flash({ errors: { editProfile: 'Preencha todos os campos solicitados' } })
            return response.redirect().toRoute('AccountController.userProfileView')
        }

        if(auth.user!.name != profile.name) {
            var studentUser = await User.findBy('email', profile.email)
            studentUser!.name = profile.name
            await studentUser!.save()
        }

        var studentProfile = await Student.findBy('userId', auth.user!.id)
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

        var interests = await Database
        .from('interests')
        .join('categories', (query) => {
          query.on('interests.category_id', '=', 'categories.id')
        })
        .whereRaw('interests.student_id = ?', [studentProfile!.id])
        .select('categories.id')
        interests = interests.map((interest) => interest.id)
        
        //fazer lógica para remover todos os que foram marcados como interesses antes e adicionar todos os novos que foram adicionados nesse update
        for(let interest of profile.interests) {
            if(!(interests.find((int) => int == interest))) {
                await Interest.create({ studentId: studentProfile!.id, categoryId: interest });
            }
        }

        return response.redirect().toRoute('userProfile.view')
    }

    public async userProfileView({auth, view} : HttpContextContract) {
        var nullPhoto = 'https://liversity-app.s3.amazonaws.com/students/photo/default-profile.jpg'
        var genders = await Gender.query().orderBy('name', 'asc')
        var campuses = await Campus.query().orderBy('name', 'asc')
        var categories = await Category.query().orderBy('id', 'asc')
        var user = await User.findBy('email', auth.user!.email)
        var student = await Student.findBy('userId', user?.id)
        var studentGender = await Gender.findBy('id', student?.genderId)
        var studentCampus = await Campus.findBy('id', student?.campusId)
        var birthDate = new Date(student?.birthDate + ' 00:00:00').toLocaleDateString()
        var interests = await Database
        .from('interests')
        .join('categories', (query) => {
          query.on('interests.category_id', '=', 'categories.id')
        })
        .whereRaw('interests.student_id = ?', [student!.id])
        .select('categories.id')
        .select('categories.name')
    
        if(!student?.completedProfile)
            return view.render('account/profilePage', { genders: genders, campuses: campuses, categories: categories, user: user, nullPhoto: nullPhoto, interests : interests })
        else
            return view.render('account/profilePage', { genders: genders, campuses: campuses, categories: categories, user: user, student: student.$attributes, birthDate : birthDate,
                                                        studentGender: studentGender?.name, studentCampus: studentCampus?.name, nullPhoto: nullPhoto, interests : interests })
    }
}
