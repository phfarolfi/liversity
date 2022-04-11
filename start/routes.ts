/* eslint-disable prettier/prettier */
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ auth,response }) => {
    await auth.use('web').check()
    if(!auth.use('web').isLoggedIn)
      return response.redirect().toRoute('login.view')
    else
      return response.redirect().toRoute('index')
})

Route.get('/Login', 'AccountController.loginView').as('login.view')
Route.post('/Login', 'AccountController.authenticate').as('login.authenticate')
Route.get('/Logout', 'AccountController.logout').as('logout')
Route.get('/SignUp', 'AccountController.signUpView').as('signUp.view')
Route.post('/SignUp', 'AccountController.createUser').as('signUp.createUser')
Route.get('/ForgotPassword', 'AccountController.forgotPasswordView').as('forgotPassword.view')

Route.get('/Home', 'EventsController.index').as('index')
Route.get('/EditProfile', 'AccountController.editProfileView').as('editProfile.view')
Route.post('/EditProfile', 'AccountController.updateProfile').as('editProfile.update')

Route.get('/CreateEvent', 'EventsController.createEvent').as('createEvent')
Route.post('/CreateEvent', 'EventsController.CreateEvent').as('createEvent.register')
Route.get('/EventPage', 'EventsController.showEvent').as('eventPage')
Route.get('/EventsPage', 'EventsController.showEvents').as("listEvents")
