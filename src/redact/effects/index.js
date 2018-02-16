import executors from "./executors";

export const install = redact => {
  redact.effectsRegistry = {};
  redact.effectExecutorRegistry = executors.defaults;
  redact.registerEffect = (effectType, handler) => {
    redact.effectsRegistry[effectType] = handler;
  };
};
