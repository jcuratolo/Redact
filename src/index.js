import redact from "./redact"

redact.action("init-db", function(state, action) {
  return {
    ...state,
    loading: {},
    users: {}
  }
})

redact.action("get-articles", function(state, action) {
  return {
    articles: {
      loading: true,
      didLoad: false
    }
  }
})

const apiUrl = "https://conduit.productionready.io/api"
const endpoint = path => [apiUrl].concat(path).join("/")

redact.effect("get-articles", function(effects, action) {
  return {
    ...effects,
    http: {
      ...effects.http,
      getArticlesRequest: {
        status: "ready",
        url: endpoint("articles"),
        method: "GET",
        onSuccess: "get-articles-success",
        onFailure: "api-request-error"
      }
    }
  }
})

redact.action("get-articles-success", function(state, action) {
  console.log(action)
  return {
    ...state,
    articles: {
      ...state.articles,
      articles: {
        articles: action.payload.data.articles,
        count: action.payload.data.articlesCount
      }
    }
  }
})

const updateRequestStatus = (request, nextStatus) => {
  return {
    ...request,
    status: nextStatus
  }
}

redact.effect("request-sent", function(effects, action) {
  const requestId = action.payload

  return {
    ...effects,
    http: {
      ...effects.http,
      ...updateRequestStatus(effects.http[requestId], "in-flight")
    }
  }
})

redact.effect("request-complete", function(effects, action) {
  const requestId = action.payload

  return {
    ...effects
  }
})

redact.dispatch("init-db", {})
redact.dispatch("get-articles")
