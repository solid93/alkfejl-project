'use strict'

const User = use('App/Model/User')
const Hash = use('Hash')

class RegisterController {

  * index(request, response) {
    yield response.sendView('account/register')
  }

  * doRegister(request, response) {
    const user = new User()
    user.username = request.input('name')
    user.email = request.input('email')
    user.password = yield Hash.make(request.input('password'))

    yield user.save()

    var registerMessage = {
      success: 'A regisztráció sikeres volt!'
    }

    yield response.sendView('account/login', { successMessage: registerMessage.success })
  }
}

module.exports = RegisterController
