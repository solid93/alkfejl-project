'use strict'

const Env = use('Env')
const Ouch = use('youch')
const Http = exports = module.exports = {}

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */

Http.handleError = function * (error, request, response) {

  if (error.status === 401) {
    yield response.sendView('account/login', { errorMessage: 'Ehhez be kell jelentkezni!' })
    return
  }

  // dev
  if (Env.get('NODE_ENV') === 'development') {
    const ouch = new Ouch().pushHandler(
      new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
    )
    ouch.handleException(error, request.request, response.response, (output) => {
      console.error(error.stack)
    })
    return
  }

  // production
  const status = error.status || 500
  console.error(error.stack)

  yield response.status(status).sendView('errors/index', {error})
}

Http.onStart = function () {
}
