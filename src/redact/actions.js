export default function install(redact) {
  redact.actionRegistry = {}
  redact.action = (id, handler) => {
    if (!id) throw new Error("Expected a non-empty id")
    if (typeof handler !== "function")
      throw new Error("Expected handler to be a function")

    redact.actionRegistry[id] = handler
  }
}
