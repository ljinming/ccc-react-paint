import React from "react";
import "./index.less";
import { useContext } from "react";
import { DispatcherContext } from "@/context";
import { CLEAR_EVENT, REDO_EVENT, UNDO_EVENT } from "../util/dispatcher/event";
//import Resize from "./Resize";
import { undoIcon, clearIcon } from "../ToolTypeIcon";

// interface propsEdit {
//   // CanvasSize: {
//   //   width: number | undefined;
//   //   height: number | undefined;
//   // };
// }

const OtherOperator = () => {
  // const { CanvasSize } = props;
  const dispatcherContext = useContext(DispatcherContext);

  const clearCanvas = () => {
    dispatcherContext.dispatcher.dispatch(CLEAR_EVENT);
  };
  const undo = () => {
    dispatcherContext.dispatcher.dispatch(UNDO_EVENT);
  };
  const redo = () => {
    dispatcherContext.dispatcher.dispatch(REDO_EVENT);
  };

  return (
    <div className="edit-other otherOperator">
      <div className="operator-content">
        {/* <span className="showSizeSpan">
          {CanvasSize.width}*{CanvasSize.height}
        </span>
        <span className="operator-resize">
          <Resize />
        </span> */}
        <span title="Clear All" className="operator-item">
          <span onClick={clearCanvas}>{clearIcon}</span>
        </span>
        <span title="Undo" className="operator-item">
          <span onClick={undo}>{undoIcon}</span>
        </span>
        <span
          title="Redo"
          style={{ transform: "rotateY(180deg)" }}
          className="operator-item"
        >
          <span onClick={redo}>{undoIcon}</span>
        </span>
      </div>
    </div>
  );
};

export default OtherOperator;
