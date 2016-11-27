'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  static get hidden () {
    return ['password']
  }

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  tasks () {
    return this.belongsToMany('App/Model/Task', 'user_task', 'user_id', 'task_id')
  }

  roles () {
    return this.belongsToMany('App/Model/Role', 'user_role', 'user_id', 'role_id')
  }

}

module.exports = User
