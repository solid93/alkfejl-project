'use strict'

const Task = use('App/Model/Task')
const Validator = use('Validator')

class TaskController {

  * index(request, response) {
    const tasks = yield Task.all()
    yield response.sendView('tasks/index', { tasks: tasks.toJSON() })
  }

  * create(request, response) {
    yield response.sendView('tasks/create')
  }

  * store(request, response) {
    const taskData = request.only('title', 'content')

    const rules = {
      title: 'required',
      content: 'required'
    }

    const validation = yield Validator.validate(taskData, rules)

    if (validation.fails()) {
      yield request
        .withOnly('title', 'content')
        .andWith({ errors: validation.messages() })
        .flash()

      response.redirect('back')
      return
    }

    yield Task.create(taskData)
    response.redirect('/')
  }

}

module.exports = TaskController
