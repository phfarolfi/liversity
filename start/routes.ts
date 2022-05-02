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
Route.get('/SignUp', 'AccountController.signUpView').as('signUp.view')
Route.post('/SignUp', 'AccountController.createUser').as('signUp.createUser')
Route.get('/ForgotPassword', 'AccountController.forgotPasswordView').as('forgotPassword.view')

Route.get('/Home', 'EventsController.index').as('index').middleware('auth');
Route.get('/Logout', 'AccountController.logout').as('logout').middleware('auth');
Route.get('/ChangePassword', 'AccountController.changePasswordView').as('changePassword.view').middleware('auth');
Route.post('/ChangePassword', 'AccountController.changePassword').as('changePassword.update').middleware('auth');
Route.get('/ProfilePage', 'AccountController.userProfileView').as('userProfile.view').middleware('auth');
Route.post('/ProfilePage', 'AccountController.updateProfile').as('userProfile.update').middleware('auth');
Route.get('CreateAdmin', 'AccountController.createAdminView').as('createAdmin.view').middleware('auth');
Route.post('/CreateAdmin', 'AccountController.createAdmin').as('createAdmin.create').middleware('auth');
Route.get('CreateProfessor', 'AccountController.createProfessorView').as('createProfessor.view').middleware('auth');
Route.post('/CreateProfessor', 'AccountController.createProfessor').as('createProfessor.create').middleware('auth');

Route.get('/CreateEvent', 'EventsController.createEventView').as('createEvent.view').middleware('auth');
Route.post('/CreateEvent', 'EventsController.createEvent').as('createEvent.create').middleware('auth');
Route.get('/UpdateEvent/:id', 'EventsController.updateEventView').as('updateEvent.view').middleware('auth');
Route.post('/UpdateEvent/:id', 'EventsController.updateEvent').as('updateEvent.update').middleware('auth');
Route.get('/UserEvents', 'EventsController.userEvents').as('userEvents.view').middleware('auth');
Route.get('/DeleteEvent/:id', 'EventsController.deleteEvent').where('id', /^[0-9]$/).as('event.delete').middleware('auth');
Route.get('/EventPage/:id', 'EventsController.eventPageView').where('id', /^[0-9]$/).as('eventPage.view').middleware('auth');
Route.get('/EventParticipants/:id', 'EventsController.eventPageParticipantsView').where('id', /^[0-9]$/).as('eventParticipants.view').middleware('auth');
Route.get('/EventsPage', 'EventsController.showEvents').as("listEvents").middleware('auth');
Route.get('/EvaluateEvents', 'EventsController.evaluateEventsView').as('evaluateEvents.view').middleware('auth');
Route.get('/EvaluateEvents/:eventId/:statusId', 'EventsController.evaluateEvents').where('eventId', /^[0-9]$/).as('evaluateEvents.update').middleware('auth');
Route.get('/ManageEventParticipants/:id', 'EventsController.manageEventParticipantsView').where('id', /^[0-9]$/).as('manageEventParticipants.view').middleware('auth');

Route.get('/*', async ({ view, }) => {
  return view.render('errors/not-found')
})