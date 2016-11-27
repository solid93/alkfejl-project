'use strict'

const Task = use('App/Model/Task')
const User = use('App/Model/User')
const Validator = use('Validator')

class TaskController {

  * index(request, response) {
    const sortby = request.param('type')
    let tasks = null

    if (sortby === 'by_me') {
      const created_by = yield request.auth.getUser()
      tasks = yield Task.query().where('created_by', created_by.id).orderBy('id', 'desc').fetch()
    }
    else if (sortby === 'tagged_in') {
      const user = yield request.auth.getUser()
      tasks = yield user.tasks().orderBy('id', 'desc').fetch()
    }
    else {
      tasks = yield Task.query().orderBy('id', 'desc').fetch()
    }

    yield response.sendView('tasks/index', { tasks: tasks.toJSON() })
  }

  * details(request, response) {
    const task = yield Task.find(request.param('id'))
    const created_by = yield User.findBy('id', task.created_by)
    const ids = yield task.users().ids()
    const selected_users = yield User.query().select('username').where('id', 'IN', ids).fetch()
    yield response.sendView('tasks/details', { task: task.toJSON(), created_by: created_by, selected_users: selected_users.toJSON() })
  }

  * search(request, response) {
    const query = '%' + request.input('query') + '%'
    const tasks = yield Task.query().where('title', 'LIKE', query).orderBy('updated_at', 'desc').fetch()
    yield response.sendView('tasks/index', { tasks: tasks.toJSON() })
  }

  * create(request, response) {

    if ( !(request.roles.hasOwnProperty('admin') || request.roles.hasOwnProperty('create')) ) {
      yield response.sendView('errors/unauthorized', { errorMessage: 'Ehhez nincs jogosultságod :(' })
      return
    }

    const users = yield User.pair('id', 'username')
    const priority = {1 : 'nagyon alacsony', 2: 'alacsony', 3: 'normál', 4: 'magas', 5: 'nagyon magas'}
    yield response.sendView('tasks/create', { users: users, priority: priority })
  }

  * edit(request, response) {

    if ( !(request.roles.hasOwnProperty('admin') || request.roles.hasOwnProperty('edit')) ) {
      yield response.sendView('errors/unauthorized', { errorMessage: 'Ehhez nincs jogosultságod :(' })
      return
    }

    const task = yield Task.find(request.param('id'))
    const users = yield User.pair('id', 'username')
    const selected_users = yield task.users().ids()
    const priority = {1 : 'nagyon alacsony', 2: 'alacsony', 3: 'normál', 4: 'magas', 5: 'nagyon magas'}
    const selected_priority = [task.priority].map(String)
    yield response.sendView('tasks/edit', { task: task.toJSON(), users: users, selected_users: selected_users.map(String), priority: priority, selected_priority: selected_priority })
  }

  * delete(request, response) {

    if ( !(request.roles.hasOwnProperty('admin') || request.roles.hasOwnProperty('delete')) ) {
      yield response.sendView('errors/unauthorized', { errorMessage: 'Ehhez nincs jogosultságod :(' })
      return
    }

    const task = yield Task.find(request.param('id'))
    const created_by = yield User.findBy('id', task.created_by)
    const ids = yield task.users().ids()
    const selected_users = yield User.query().select('username').where('id', 'IN', ids).fetch()
    yield response.sendView('tasks/delete', { task: task.toJSON(), created_by: created_by, selected_users: selected_users.toJSON() })
  }

  * store(request, response) {

    const data = request.only('title', 'content', 'priority', 'users')

    const rules = {
      title: 'required',
      priority: 'required|range:0,6',
      users: 'required'
    }

    const messages = {
      required: '{{field}} mező kitöltése kötelező.',
      'title.required': 'A "Feladat rövid leírása" mező kitöltése kötelező.',
      'priority.required': 'A "Feladat prioritása" mező kitöltése kötelező.',
      'users.required': 'A "Kihez legyen rendelve a feladat?" mező kitöltése kötelező.'
    }

    const validation = yield Validator.validate(data, rules, messages)

    if (validation.fails()){
      yield request.withOnly('title', 'content', 'priority', 'users').andWith({ errors: validation.messages() }).flash()
      response.redirect('back')
      return
    }

    const created_by = yield request.auth.getUser()

    const task = new Task()
    task.created_by = created_by.id
    task.title = data.title
    task.content = data.content
    task.priority = data.priority
    task.finished = false
    yield task.save()
    yield task.users().attach(data.users)

    response.redirect('/tasks')
  }

  * update(request, response) {

    const data = request.only('id', 'title', 'content', 'priority', 'users', 'finished')

    const rules = {
      id: 'required',
      title: 'required',
      priority: 'required|range:0,6',
      users: 'required'
    }

    const messages = {
      required: '{{field}} mező kitöltése kötelező.',
      'id.required': 'Hiányzik az azonosító.',
      'title.required': 'A "Feladat rövid leírása" mező kitöltése kötelező.',
      'priority.required': 'A "Feladat prioritása" mező kitöltése kötelező.',
      'users.required': 'A "Kihez legyen rendelve a feladat?" mező kitöltése kötelező.'
    }

    const validation = yield Validator.validate(data, rules, messages)

    if (validation.fails()){
      yield request.withOnly('id', 'title', 'content', 'priority', 'users', 'finished').andWith({ errors: validation.messages() }).flash()
      response.redirect('back')
      return
    }

    const task = yield Task.findBy('id', data.id)
    task.title = data.title
    task.content = data.content
    task.priority = data.priority
    task.finished = data.finished || '0'
    yield task.save()
    yield task.users().sync(data.users)
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
