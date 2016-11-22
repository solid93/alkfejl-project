'use strict'

const Role = use('App/Model/Role')
const User = use('App/Model/User')
const Validator = use('Validator')

class RoleController {

  * index(request, response) {
    const roles = yield Role.query().orderBy('id', 'desc').fetch()
    yield response.sendView('roles/index', { roles: roles.toJSON() })
  }

  * create(request, response) {

    const db_has_roles = yield Role.find(1)

    if (db_has_roles !== null) {
      if (!request.roles.hasOwnProperty('admin')) {
        yield response.sendView('roles/index', { errorMessage: 'Ehhez nincs jogosultsága!' })
        return
      }
    }

    const users = yield User.pair('id', 'username')
    yield response.sendView('roles/create', { users: users })
  }

  * store(request, response) {

    const data = request.only('title', 'details', 'users')

    const rules = {
      title: 'required'
    }

    const messages = {
      required: '{{field}} mező kitöltése kötelező.',
      'title.required': 'A "Feladat rövid leírása" mező kitöltése kötelező.'
    }

    const validation = yield Validator.validate(data, rules, messages)

    if (validation.fails()){
      yield request.withOnly('title', 'details', 'users').andWith({ errors: validation.messages() }).flash()
      response.redirect('back')
      return
    }

    const role = new Role()
    role.title = data.title
    role.details = data.details

    yield role.save()
    if (typeof data.users !== 'undefined' && data.users !== null) {
      yield role.users().attach(data.users)
    }

    response.redirect('/roles')
  }

}

module.exports = RoleController
