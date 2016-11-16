'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/', 'HomeController.index')

Route.get('/tasks', 'TaskController.index')
Route.get('/tasks/create', 'TaskController.create')
Route.get('/tasks/edit/:id', 'TaskController.edit')
Route.post('/tasks', 'TaskController.store')

Route.get('/account/login', 'AuthController.index')
Route.post('/account/login', 'AuthController.login')

Route.get('account/register', 'RegisterController.index')
Route.post('account/register', 'RegisterController.doRegister')

Route.get('account/logout', 'AuthController.logout')