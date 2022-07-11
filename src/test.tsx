import { Provider } from "react-redux";
import { store } from "./Action";
import CCCPaint from "./pages";

const CCC = () => {
  return (
    <Provider store={store}>
      <CCCPaint id={"test"} />
    </Provider>
  );
};

export default CCC;
