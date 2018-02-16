import React from "react";
import { connect, Provider } from "react-redux";

export const install = redact => {
  redact.component = (name, renderFn) => {
    const component = class extends React.PureComponent {
      render() {
        return renderFn(this.props, redact.store.getState(), redact.dispatch);
      }
    };
    component.displayName = name || "RedactComponent";

    return connect()(component);
  };
  return redact;
};
