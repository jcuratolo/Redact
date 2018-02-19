sendRequest = (http, id, config, dispatch) => {
    const { url, method } = config

    switch (method) {
        case "GET": return completeRequest(id, http.get(url), config, dispatch)

        default:
            return
    }
}

const completeRequest = (id, request, config, dispatch) => {
    const { success, error, always } = config
    
    return request
        .then(res => success && dispatch(success, { id, response: res }))
        .catch(err => error && dispatch(error, { id, error: err }, true))
        .then(() => {
            always && dispatch(always, id)
            dispatch('request-complete', id)
        })
}

const processor = (handlers, httpFx, dispatch) => {
    if (!httpFx) return

    Object.keys(httpFx).forEach(id => {
        const config = httpFx[id]

        switch (config.status) {
            case 'ready':
                return handlers.ready(id, config, dispatch)
            case 'done':
                return handlers.done(id, config, dispatch)
            default:
                throw new Error(`Invalid http request status ${config.status} on request id ${id}`)
        }
    })
}

module.exports = {sendRequest, completeRequest, processor}