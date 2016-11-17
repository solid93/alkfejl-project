'use strict'

const Lucid = use('Lucid')

class Task extends Lucid {

  users () {
    return this.belongsToMany('App/Model/User', 'user_task', 'task_id', 'user_id')
  }

}

module.exports = Task
