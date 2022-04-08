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

//pegar essa informação do cookie / sessão mais para frente
let isLoggedIn = false

Route.get('/', ({ response }) => {
  if (!isLoggedIn) {
    return response.redirect().toRoute('login.create')
  } else {
    return response.redirect().toRoute('index')
  }
})

Route.get('/Login', 'AccountController.create').as('login.create')
Route.post('/Login', 'AccountController.store').as('login.store')

Route.get('/SignUp', 'AccountController.signUp').as('signUp')
Route.post('/SignUp', 'AccountController.createUser').as('signUp.store')

Route.get('/ForgotPassword', 'AccountController.forgotPassword').as('forgotPassword')
Route.get('/Home', 'EventsController.index').as('index')
Route.get('/CreateEvent', 'EventsController.createEvent').as('createEvent')
Route.get('/EventPage', 'EventsController.showEvent').as('eventPage')
Route.get('/EventsPage', 'EventsController.showEvents').as("listEvents")
Route.get('/EditProfile', 'AccountController.editProfile').as('editProfile')
