import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";

const redact = {};

redact.events = {};
redact.effects = {};
redact.state = {};

redact.store = createStore((state, event) => {
  if (!redact.events[event.type]) return state;
  return Object.assign({}, state, redact.events[event.type](event.payload));
});

redact.render = (RootComponent, target) => {
  render(
    <Provider store={redact.store}>
      <RootComponent />
    </Provider>,
    target
  );
};

redact.event = (eventType, handler) => {
  redact.events[eventType] = handler;
};

redact.dispatch = (eventType, payload) => {
  redact.store.dispatch({ type: eventType, payload });
};

const defaultMapStateToProps = state => state;
const defaultMapDispatchToProps = dispatch => {};

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
