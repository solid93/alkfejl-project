'use strict'

const Lucid = use('Lucid')

class Role extends Lucid {

  users () {
    return this.belongsToMany('App/Model/User', 'user_role', 'role_id', 'user_id')
  }

}

module.exports = Role
