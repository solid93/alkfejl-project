'use strict'

const Schema = use('Schema')

class UserTaskTableSchema extends Schema {

  up () {
    this.create('user_task', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('task_id').unsigned().references('id').inTable('tasks')
    })
  }

  down () {
    this.drop('user_task')
  }

}

module.exports = UserTaskTableSchema
