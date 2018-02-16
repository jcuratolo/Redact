export default function install(redact) {
  const actionRegistry = {}

  redact.action = handler => {
    if (typeof handler !== "function")
      throw new Error("Expected handler to be a function")
    if (!handler.name) throw new Error("Expected handler to have a name")

    actionRegistry[handler.name] = handler
  }
}
