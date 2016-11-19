'use strict'

const User = use('App/Model/User')
const Hash = use('Hash')

class AuthController {

  * index(request, response) {
    yield response.sendView('account/login')
  }

  * login(request, response) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      yield request.auth.attempt(email, password)
    }
    catch (e) {
      yield response.sendView('account/login', { errorMessage: 'Hibás adatokat adott meg!' })
    }

    return response.redirect('/tasks')
  }

  * logout(request, response) {
    yield request.auth.logout()

    return response.redirect('/')
  }

}

module.exports = AuthController
