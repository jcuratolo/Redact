import http from './http'

// Iterate through effects, hand them off to the correct interpreter
const processEffects = (processors, effects, dispatch) => {
  Object
    .keys(effects)
    .forEach(effect => processors[effect](effect, dispatch))
}

// Register a handler that returns effects
const registerEffect = (id, handler) => {
  if (typeof handler !== "function")
    throw new Error("Expected handler to be a function")

  redact.effectRegistry[id] = handler
}

// Register a function to process effects of a specified type
const registerEffectProcessor = (effectType, processor) => {
  if (!typeof processor !== 'function')
    throw new Error('Expected processor to be a function')

  redact.effectProcessorRegistry[effectType] = processor
}

// Install effect functionality 
const install = redact => {
  redact.effectRegistry = {}
  redact.effectProcessorRegistry = {}
  redact.effect = registerEffect
  redact.effectProcessor = registerEffectProcessor

  if (!redact.store) throw new Error("Redact store must be installed before effects")

  // Process effects every time an event is dispatched
  redact.store.subscribe(() => {
    processEffects(
      redact.effectProcessorRegistry,
      redact.store.getState(),
      redact.dispatch)
  })
}

export * from http
export { install }
