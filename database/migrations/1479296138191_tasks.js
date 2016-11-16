'use strict'

const Schema = use('Schema')

class TasksTableSchema extends Schema {

  up () {
    this.create('tasks', (table) => {
      table.increments()
      table.string('title')
      table.text('content')
      table.enu('priority', ['very high', 'high', 'normal', 'low', 'very low'])
      table.timestamps()
    })
  }

  down () {
    this.drop('tasks')
  }

}

module.exports = TasksTableSchema
