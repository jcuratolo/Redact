const test = require('tape')
const { processor, sendRequest, completeRequest } = require('./http')

test('Handles requests with valid statuses (ready, done)', t => {
    const httpFx = {
        readyRequest: {
            status: 'ready',
            url: 'api',
            method: 'GET',
            success: 'request-successful',
            error: 'request-failed',
            always: 'request-complete'
        },
        doneRequest: {
            status: 'done'
        }
    }

    const handlers = {
        ready: (id, config, dispatch) => {
            t.is(config, httpFx.readyRequest)
        },
        done: (id, config, dispatch) => {
            t.is(config, httpFx.doneRequest)
        }
    }

    processor(handlers, httpFx)
    t.end()
})

test('Throws on invalid status', t => {
    const handlers = {}
    const httpFx = {
        someRequest: {
            status: 'derp'
        }
    }

    t.throws(() => processor(handlers, httpFx))
    t.end()
})

test('Dispatches specified success event when request succeeds', t => {
    const response = { awesome: true }
    const successfulRequest = Promise.resolve(response)
    const requestId = 'awesomeRequest'
    const config = {
        success: 'great-success',
        error: 'request-failed',
    }
    const callArgs = []

    completeRequest(
        requestId,
        successfulRequest,
        config,
        (type, payload, error, meta) => {
            callArgs.push([type, payload, error, meta])
        })
        .then(() => {
            let [type, payload, error, meta] = callArgs[0]

            t.is(type, config.success)
            t.is(payload.id, requestId)
            t.is(payload.response, response)
            t.is(error, void 0)
            t.end()
        })
})

test('Dispatches specified error event when request fails', t => {
    const response = { awesome: true }
    const failedRequest = Promise.reject(response)
    const requestId = 'awesomeRequest'
    const config = {
        success: 'great-success',
        error: 'request-failed',
    }
    const callArgs = []

    completeRequest(
        requestId,
        failedRequest,
        config,
        (type, payload, error, meta) => {
            callArgs.push([type, payload, error, meta])
        }).then(() => {
            const [type, payload, error, meta] = callArgs[0]

            t.is(type, config.error)
            t.is(payload.id, requestId)
            t.is(payload.error, response)
            t.is(error, true)
            t.end()
        })
})

test('Dispatches request-complete event after successful request', t => {
    const callArgs = []
    const id = 'my-request'

    completeRequest(
        id,
        Promise.resolve({ derp: true }),
        {},
        (type, payload, error, meta) => {
            callArgs.push([type, payload, error, meta])
        }).then(() => {
            [type, payload] = callArgs[callArgs.length - 1]
            t.is(type, 'request-complete')
            t.is(payload, id)
            t.end()
        })
})

test('Dispatches request-complete event after failed request', t => {
    const callArgs = []
    const id = 'my-request'

    completeRequest(
        id,
        Promise.reject({ derp: true }),
        {},
        (type, payload, error, meta) => {
            callArgs.push([type, payload, error, meta])
        }).then(() => {
            [type, payload] = callArgs[callArgs.length - 1]
            t.is(type, 'request-complete')
            t.is(payload, id)
            t.end()
        })
})

test('Sends requests with valid http methods', t => {
    const config = { url: 'apiUrl', method: 'GET' }
    const mockHttpClient = {
        get: url => {
            debugger;
            t.is(url, config.url)
            t.end()
            return Promise.resolve()
        }
    }
    const id = 'someRequest'
    const dispatch = () => { }

    sendRequest(mockHttpClient, id, config, dispatch)
})

