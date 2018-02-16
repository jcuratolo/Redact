import { createStore } from "redux"
import axios from "axios"
import actions from "./actions"
import effects from "./effects"
import component from "./component"

const redact = {}

actions(redact)
effects(redact)

const defaultInitialState = {
  state: {},
  effects: {}
}

redact.store = createStore(function(state = defaultInitialState, action) {
  const actionHandler = redact.actionRegistry[action.type]
  const effectHandler = redact.effectRegistry[action.type]

  console.table(action)

  if (action.type === "@@redux/INIT") return state

  return {
    state: actionHandler ? actionHandler(state.state, action) : state.state,
    effects: effectHandler
      ? effectHandler(state.effects, action)
      : state.effects
  }
})

const sendRequest = (id, config, dispatch) => {
  switch (config.method) {
    case "GET":
      axios
        .get(config.url)
        .then(response => dispatch(config.onSuccess, response))
        .catch(error => dispatch(config.onFailure, error, true))
        .then(() => dispatch("request-complete", id))

      dispatch("request-sent", id)
      return

    default:
      return
  }
}

const httpEffectExecutor = (httpEffects, dispatch) => {
  if (!httpEffects) return

  Object.keys(httpEffects).forEach(id => {
    const config = httpEffects[id]

    switch (config.status) {
      case "ready":
        return sendRequest(id, config, dispatch)
      default:
        return
    }
  })
}

redact.store.subscribe(() => {
  const state = redact.store.getState()

  httpEffectExecutor(state.effects.http, redact.dispatch)
})

redact.dispatch = (id, payload = {}, error, meta) => {
  const action = {}

  action.type = id
  action.payload = payload

  if (error) action.error = true
  if (meta) action.meta = meta

  console.log(action)
  redact.store.dispatch(action)
}

export default redact
