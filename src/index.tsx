import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./Action";
import CCCPaint from "./pages";

ReactDOM.render(
  <Provider store={store}>
    <CCCPaint id={"test"} />
  </Provider>,
  document.getElementById("root")
);
