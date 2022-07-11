import { createStore } from "redux";

function todos(state = [], action: any) {
  console.log("===45", action);
  switch (action.type) {
    case "paint.tool":
      return action.select;
    default:
      return state;
  }
}
export const store = createStore(todos);
