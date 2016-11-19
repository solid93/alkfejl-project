'use strict'

const Schema = use('Schema')

class TasksTableSchema extends Schema {

  up () {
    this.create('tasks', (table) => {
      table.increments()
      table.integer('created_by').unsigned().references('id').inTable('users')
      table.string('title')
      table.text('content')
      table.integer('priority')
      table.boolean('finished')
      table.timestamps()
    })
  }

  down () {
    this.drop('tasks')
  }

}

module.exports = TasksTableSchema
