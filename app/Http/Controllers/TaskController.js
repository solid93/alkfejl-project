'use strict'

const Task = use('App/Model/Task')
const Validator = use('Validator')
const Database = use('Database')

class TaskController {

  * index(request, response) {
    const tasks = yield Task.query().orderBy('id', 'desc').fetch()
    yield response.sendView('tasks/index', { tasks: tasks.toJSON() })
  }

  * details(request, response) {
    const task = yield Task.find(request.param('id'))

    yield response.sendView('tasks/details', { task: task.toJSON() })
  }

  * search(request, response) {
    const query = '%' + request.input('query') + '%'
    const tasks = yield Task.query().where('title', 'LIKE', query).orderBy('updated_at', 'desc').fetch()
    yield response.sendView('tasks/index', { tasks: tasks.toJSON() })
  }

  * create(request, response) {
    yield response.sendView('tasks/create')
  }

  * edit(request, response) {
    const task = yield Task.find(request.param('id'))

    yield response.sendView('tasks/edit', { task: task.toJSON() })
  }

  * store(request, response) {
    const task = new Task()

    task.title = request.input('title')
    task.content = request.input('content')
    task.priority = request.input('priority')
    task.finished = request.input('finished', '0')

    yield task.save()
    response.redirect('/tasks')
  }

  * update(request, response) {
    const task = yield Task.findBy('id', request.input('id'))

    task.title = request.input('title')
    task.content = request.input('content')
    task.priority = request.input('priority')
    task.finished = request.input('finished', '0')

    yield task.save()
    response.redirect('/tasks')
  }

}

module.exports = TaskController
