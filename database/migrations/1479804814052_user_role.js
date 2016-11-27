'use strict'

const Schema = use('Schema')

class UserRoleTableSchema extends Schema {

  up () {
    this.create('user_role', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('role_id').unsigned().references('id').inTable('roles')
    })
  }

  down () {
    this.drop('user_role')
  }

}

module.exports = UserRoleTableSchema
