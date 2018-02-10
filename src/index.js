import React from "react";
import redact from "./redact";

const LOGIN_FORM_SUBMIT = "loginForm.submit";
const LOGIN_FORM_UPDATE = "loginForm.update";

const PageTitle = redact.component("PageTitle", (props, state, dispatch) => {
  return <h1>HERROW!</h1>;
});

const updateLoginForm = dispatch => e =>
  dispatch("loginForm.update", { name: e.target.name, value: e.target.value });

const LoginForm = redact.component("LoginForm", (props, state, dispatch) => {
  console.log("RENDER");
  return (
    <form>
      <PageTitle />
      <input
        type="text"
        name="email"
        placeholder="email"
        onInput={updateLoginForm(dispatch)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        onInput={updateLoginForm(dispatch)}
      />
    </form>
  );
});

redact.event(LOGIN_FORM_UPDATE, (state, payload) => {
  console.log(LOGIN_FORM_UPDATE);
  state.loginForm[payload.name] = payload.value;
  return state;
});

redact.render(LoginForm, document.getElementById("root"));
