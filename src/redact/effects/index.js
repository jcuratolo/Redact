export default function(redact) {
  redact.effectRegistry = {}
  redact.effect = (id, handler) => {
    if (typeof handler !== "function")
      throw new Error("Expected handler to be a function")

    redact.effectRegistry[id] = handler
  }
}
