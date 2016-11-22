'use strict'

const Role = use('App/Model/Role')
const User = use('App/Model/User')
const Database = use('Database')

class RoleDetector {

  * handle (request, response, next) {
    const user = yield request.auth.getUser()
    request.roles = null

    if (user !== null) {
      request.roles = yield user.roles().pair('title', 'id')
    }

    yield next
  }

}

module.exports = RoleDetector
