import test from 'ava'
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
})

test('Throws on invalid status', t => {
    t.throws(() => {
        http({}, {
            someRequest: {
                status: 'derp'
            }
        })
    })
})

test('Dispatches specified success event', async t => {
    const response = { awesome: true }
    const successfulRequest = Promise.resolve(response)
    const failedRequest = Promise.reject(response)
    const requestId = 'awesomeRequest'
    const config = {
        success: 'great-success',
        error: 'request-failed',
    }

    completeRequest(
        requestId, 
        successfulRequest, 
        config, 
        (type, payload, error, meta) => {
            t.is(type, config.success)
            t.is(payload.id, requestId)
            t.is(payload.response, response)
            t.is(error, void 0)
        }
    )

    completeRequest(
        requestId,
        failedRequest,
        config,
        (type, payload, error, meta) => {
            t.is(type, config.error)
            t.is(payload.id, requestId)
            t.is(payload.error, response)
            t.is(error, true)
        }
    )
})

test('Dispatches specified error event', async t => {
    const response = { awesome: true }
    const failedRequest = Promise.reject(response)
    const requestId = 'awesomeRequest'
    const config = {
        success: 'great-success',
        error: 'request-failed',
    }

    completeRequest(
        requestId,
        failedRequest,
        config,
        (type, payload, error, meta) => {
            t.is(type, config.error)
            t.is(payload.id, requestId)
            t.is(payload.error, response)
            t.is(error, true)
        }
    )
})

test('Dispatches request-complete after every request', async t => {
    await completeRequest(
        'my-request',
        Promise.resolve(),
        {},
        (type, payload, error, meta) => {
            t.is(type, 'request-complete')
            t.is(payload, 'my-request')
        }
    )

    await completeRequest(
        'my-request',
        Promise.reject(),
        {},
        (type, payload, error, meta) => {
            t.is(type, 'request-complete')
            t.is(payload, 'my-request')
        }
    )
})


test.skip('Sends requests with valid http methods', t => {
    const config = { url: 'apiUrl' }
    const mockHttpClient = {
        get: url => t.is(url, config.url)
    }

    sendRequest(mockHttpClient, 'someRequest', () => { }, config)
})

