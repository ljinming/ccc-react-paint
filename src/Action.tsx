import { createStore } from "redux";

let initialState = {
  "paint.tool": {
    select: "PEN",
  },
  "paint.straw": {
    strawFlag: false,
    strawColor: "",
  },
};

function todos(state = initialState, action: any) {
  switch (action.type) {
    case "paint.tool":
      state[action.type].select = action.select;
      return { ...state };
    default:
      state[action.type] = action.payload;
      return { ...state };
  }
}

export const store = createStore(todos);
