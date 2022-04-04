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

if (!isLoggedIn) {
  Route.on('/').redirect('/Login')
} else {
  Route.on('/').redirect('/')
}
Route.get('/Login', 'AccountController.login').as('login')
Route.get('/ForgotPassword', 'AccountController.forgotPassword').as('forgotPassword')
Route.get('/SignUp', 'AccountController.signUp').as('signUp')
// Route.get('/', 'EventsController.index').as('index')
Route.get('/ProfilePage', 'EventsController.index').as('index')
Route.get('/EventPage', 'EventsController.seeEvent').as('eventPage')
Route.get('/CreateEvent', 'EventsController.createEvent').as('createEvent')
Route.get('/EventsPage', 'EventsController.seeEvents')
Route.get('/EditProfile', 'AccountController.editProfile').as('editProfile')
