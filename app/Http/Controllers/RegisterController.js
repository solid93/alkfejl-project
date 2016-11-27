'use strict'

const User = use('App/Model/User')
const Hash = use('Hash')
const Validator = use('Validator')

class RegisterController {

  * index(request, response) {
    yield response.sendView('account/register')
  }

  * register(request, response) {

    const data = request.only('name', 'email', 'password')

    const rules = {
      name: 'required|alpha',
      email: 'required|email',
      password: 'required'
    }

    const messages = {
      required: '{{field}} mező kitöltése kötelező.',
      'name.alpha': 'A névben csak betűk szerepelhetnek!',
      'email.email': 'Az email cím helytelen formátumú!'
    }

    const validation = yield Validator.validate(data, rules, messages)

    if (validation.fails()){
      yield request.withOnly('name', 'email', 'password').andWith({ errors: validation.messages() }).flash()
      response.redirect('back')
      return
    }

    const user = new User()
    user.username = data.name
    user.email = data.email
    user.password = yield Hash.make(data.password)

    yield user.save()

    yield response.sendView('account/login', { successMessage: 'Sikeres regisztráció, jelentkezzen be!' })
  }
}

module.exports = RegisterController
