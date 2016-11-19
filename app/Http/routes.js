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

Route.group('auth-routes', () => {
  Route.get('/tasks', 'TaskController.index')
  Route.post('/tasks', 'TaskController.search')
  Route.get('/tasks/details/:id', 'TaskController.details')
  Route.post('/tasks/details', 'TaskController.finish')
  Route.get('/tasks/create', 'TaskController.create')
  Route.post('/tasks/create', 'TaskController.store')
  Route.get('/tasks/edit/:id', 'TaskController.edit')
  Route.post('/tasks/edit', 'TaskController.update')
  Route.get('/tasks/delete/:id', 'TaskController.delete')
  Route.post('/tasks/delete', 'TaskController.remove')
}).middleware('auth')

Route.get('/account/login', 'AuthController.index')
Route.post('/account/login', 'AuthController.login')

Route.get('account/register', 'RegisterController.index')
Route.post('account/register', 'RegisterController.doRegister')

Route.get('account/logout', 'AuthController.logout')