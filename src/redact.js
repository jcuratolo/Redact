import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";

const redact = {};

redact.actions = {};
redact.effects = {};
redact.state = {};

redact.store = createStore((state, action) => {
  if (!redact.actions[action.type]) return state;
  return Object.assign({}, state, redact.actions[action.type](state, action));
});

redact.render = (RootComponent, target) => {
  render(
    <Provider store={redact.store}>
      <RootComponent />
    </Provider>,
    target
  );
};

redact.action = (actionType, handler) => {
  redact.actions[actionType] = handler;
};

redact.dispatch = (actionType, payload, error, meta) => {
  const action = {};
  action.type = actionType;
  action.payload = payload;
  if (error) action.error = error;
  if (meta) action.meta = meta;

  redact.store.dispatch(action);
};

redact.component = (name, renderFn) => {
  const component = class extends React.PureComponent {
    render() {
      return renderFn(this.props, redact.store.getState(), redact.dispatch);
    }
  };
  component.displayName = name || "RedactComponent";

  return connect()(component);
};

export default redact;
