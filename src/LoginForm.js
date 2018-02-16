import redact from "./redact";

const updateLoginForm = dispatch => e =>
  dispatch("loginForm.update", { name: e.target.name, value: e.target.value });

export default redact.component("LoginForm", (props, state, dispatch) => {
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
