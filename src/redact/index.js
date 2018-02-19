import { createStore } from "redux"
import axios from "axios"

import actions from "./actions"
import effects from './effects'

const redact = {}

actions(redact)
effects.install(redact)

const defaultInitialState = {
  state: {},
  effects: {}
}

redact.store = createStore(function({state, effects} = defaultInitialState, action) {
  const actionHandler = redact.actionRegistry[action.type]
  const effectHandler = redact.effectRegistry[action.type]

  if (action.type === "@@redux/INIT") return state
  
  const nextState = {}
  
  if (actionHandler) nextState.state = actionHandler(state, action)
  if (effectHandler) nextState.effects = effectHandler(effects, action)

  return nextState
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
