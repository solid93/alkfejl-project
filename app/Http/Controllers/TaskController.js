'use strict'

const Task = use('App/Model/Task')
const User = use('App/Model/User')
//const Validator = use('Validator')

class TaskController {

  * index(request, response) {
    const tasks = yield Task.query().orderBy('id', 'desc').fetch()
    yield response.sendView('tasks/index', { tasks: tasks.toJSON() })
  }

  * details(request, response) {
    const task = yield Task.find(request.param('id'))
    const ids = yield task.users().ids()
    const selected_users = yield User.query().select('username').where('id', 'IN', ids).fetch()
    yield response.sendView('tasks/details', { task: task.toJSON(), selected_users: selected_users.toJSON() })
  }

  * search(request, response) {
    const query = '%' + request.input('query') + '%'
    const tasks = yield Task.query().where('title', 'LIKE', query).orderBy('updated_at', 'desc').fetch()
    yield response.sendView('tasks/index', { tasks: tasks.toJSON() })
  }

  * create(request, response) {
    const users = yield User.pair('id', 'username')
    const priority = {1 : 'nagyon alacsony', 2: 'alacsony', 3: 'normál', 4: 'magas', 5: 'nagyon magas'}
    yield response.sendView('tasks/create', { users: users, priority: priority })
  }

  * edit(request, response) {
    const task = yield Task.find(request.param('id'))
    const users = yield User.pair('id', 'username')
    const selected_users = yield task.users().ids()
    const priority = {1 : 'nagyon alacsony', 2: 'alacsony', 3: 'normál', 4: 'magas', 5: 'nagyon magas'}
    const selected_priority = [task.priority].map(String)
    yield response.sendView('tasks/edit', { task: task.toJSON(), users: users, selected_users: selected_users.map(String), priority: priority, selected_priority: selected_priority })
  }

  * delete(request, response) {
    const task = yield Task.find(request.param('id'))
    const ids = yield task.users().ids()
    const selected_users = yield User.query().select('username').where('id', 'IN', ids).fetch()
    yield response.sendView('tasks/delete', { task: task.toJSON(), selected_users: selected_users.toJSON() })
  }

  * store(request, response) {
    const users = request.input('users')
    const task = new Task()
    task.title = request.input('title')
    task.content = request.input('content')
    task.priority = request.input('priority')
    task.finished = false
    yield task.save()
    yield task.users().attach(users)
    response.redirect('/tasks')
  }

  * update(request, response) {
    const users = request.input('users') // todo: handle null /no option selected/
    const task = yield Task.findBy('id', request.input('id'))
    task.title = request.input('title')
    task.content = request.input('content')
    task.priority = request.input('priority')
    task.finished = request.input('finished', '0')
    yield task.save()
    yield task.users().sync(users)
    response.redirect('/tasks')
  }

  * remove(request, response) {
    const task = yield Task.findBy('id', request.input('id'))
    const userids = yield task.users().ids()
    yield task.users().detach(userids)
    yield task.delete()
    response.redirect('/tasks')
  }

  * finish(request, response) {
    const task = yield Task.findBy('id', request.input('id'))
    task.finished = 1
    yield task.save()
    response.redirect('/tasks/details/' + request.input('id'))
  }

}

module.exports = TaskController
