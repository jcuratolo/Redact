import axios from "axios";

export const defaults = {
  state: (store, action, dispatch, nextState) => {
    dispatch("state-merge", nextState);
  },
  http: (
    state,
    action,
    dispatch,
    { url, method, body, onSuccess, onFailure }
  ) => {
    switch (method.toUpperCase()) {
      case "GET":
        return axios
          .get(url)
          .then(res =>
            onSuccess.forEach(actionType => dispatch(actionType, res))
          )
          .catch(err =>
            onFailure.forEach(actionType => dispatch(actionType, err))
          );

      case "POST":
      case "DELETE":
      case "PUT":
      default:
        return;
    }
  }
};
