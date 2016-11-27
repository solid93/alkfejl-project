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
      if ( !(request.roles.hasOwnProperty('admin')) ) {
        yield response.sendView('errors/unauthorized', { errorMessage: 'Ehhez nincs jogosultságod :(' })
        return
      }
    }

    const users = yield User.pair('id', 'username')
    yield response.sendView('roles/create', { users: users })
  }

  * edit(request, response) {

    if ( !(request.roles.hasOwnProperty('admin')) ) {
      yield response.sendView('errors/unauthorized', { errorMessage: 'Ehhez nincs jogosultságod :(' })
      return
    }

    const role = yield Role.find(request.param('id'))
    const users = yield User.pair('id', 'username')
    const selected_users = yield role.users().ids()
    yield response.sendView('roles/edit', { role: role.toJSON(), users: users, selected_users: selected_users.map(String) })
  }

  * delete(request, response) {

    if ( !(request.roles.hasOwnProperty('admin')) ) {
      yield response.sendView('errors/unauthorized', { errorMessage: 'Ehhez nincs jogosultságod :(' })
      return
    }

    const role = yield Role.find(request.param('id'))
    const users = yield User.pair('id', 'username')
    const selected_users = yield role.users().ids()
    yield response.sendView('roles/delete', { role: role.toJSON(), users: users, selected_users: selected_users.map(String) })
  }

  * store(request, response) {

    const data = request.only('title', 'details', 'users')

    const rules = {
      title: 'required'
    }

    const messages = {
      required: '{{field}} mező kitöltése kötelező.',
      'title.required': 'A "Jogosultság neve" mező kitöltése kötelező.'
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

  * update(request, response) {

    const data = request.only('id', 'title', 'details', 'users')

    const rules = {
      id: 'required',
      title: 'required'
    }

    const messages = {
      required: '{{field}} mező kitöltése kötelező.',
      'title.required': 'A "Jogosultság neve" mező kitöltése kötelező.'
    }

    const validation = yield Validator.validate(data, rules, messages)

    if (validation.fails()){
      yield request.withOnly('id, title', 'details', 'users').andWith({ errors: validation.messages() }).flash()
      response.redirect('back')
      return
    }

    const role = yield Role.findBy('id', data.id)
    role.title = data.title
    role.details = data.details
    yield role.save()

    const selected_users = data.users || []

    if (selected_users < 1) {
      const users = yield User.ids()
      yield role.users().detach(users)
    }
    else {
      yield role.users().sync(selected_users)
    }

    response.redirect('/roles')
  }

  * remove(request, response) {
    const role = yield Role.findBy('id', request.input('id'))
    const userids = yield role.users().ids()
    yield role.users().detach(userids)
    yield role.delete()
    response.redirect('/roles')
  }

}

module.exports = RoleController
