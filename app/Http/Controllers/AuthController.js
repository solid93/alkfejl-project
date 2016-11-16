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

    const loginMessage = {
      error: 'Hibás adatokat adott meg!'
    }

    try {
      yield request.auth.attempt(email, password)
      yield response.sendView('home')
    }
    catch (e) {
      yield response.sendView('account/login', { errorMessage: loginMessage.error })
    }

  }

  * logout(request, response) {
    yield request.auth.logout()

    return response.redirect('/')
  }

}

module.exports = AuthController
