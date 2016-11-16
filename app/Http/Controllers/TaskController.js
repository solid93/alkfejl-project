'use strict'

const Task = use('App/Model/Task')
const Validator = use('Validator')
const Database = use('Database')

class TaskController {

  * index(request, response) {
    const tasks = yield Task.all()
    yield response.sendView('tasks/index', { tasks: tasks.toJSON() })
  }

  * create(request, response) {
    yield response.sendView('tasks/create')
  }

  * edit(request, response) {
    const id = request.param('id')
    const task = yield Database.table('tasks').where('id', id).limit(1)

    yield response.sendView('tasks/edit', { task: task })
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
