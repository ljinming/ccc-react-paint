import React from "react";
import { ToolType } from "../util/toolType";
import { ToolTypeContext } from "@/context";
import "./index.less";
import { toolPen, toolShape, formatColor, textIcon, toolEraser } from "./util";
const selectedToolClass = "selected-tool";

export interface ToolPanelProps {
  className?: string;
  fillColor?: string;
}

const ToolPanel: React.FC<ToolPanelProps> = (props) => {
  const { className, fillColor } = props;
  return (
    <div className={className ? `toolpanel ${className}` : "toolpanel"}>
      <ToolTypeContext.Consumer>
        {({ type, setType }) => (
          <>
            <span title="Pencil Tool" className="tool-Icon">
              <span
                className={
                  type === ToolType.PEN
                    ? `tool-item ${selectedToolClass}`
                    : "tool-item"
                }
                onClick={() => {
                  setType(ToolType.PEN);
                }}
              >
                {toolPen}
              </span>
            </span>
            <span title="Draw Shape" className="tool-Icon">
              <span
                className={
                  type === ToolType.SHAPE
                    ? `tool-item ${selectedToolClass}`
                    : "tool-item"
                }
                onClick={() => {
                  setType(ToolType.SHAPE);
                }}
              >
                {toolShape}
              </span>
            </span>
            <span title="Eraser Tool" className="tool-Icon">
              <span
                className={
                  type === ToolType.ERASER
                    ? `tool-item ${selectedToolClass}`
                    : "tool-item"
                }
                onClick={() => {
                  setType(ToolType.ERASER);
                }}
              >
                {toolEraser}
              </span>
            </span>
            <span title="Paint Bucket Tool" className="tool-Icon">
              <span
                className={
                  type === ToolType.COLOR_FILL
                    ? `tool-item color-tool ${selectedToolClass}`
                    : "tool-item color-tool"
                }
                onClick={() => {
                  setType(ToolType.COLOR_FILL);
                }}
              >
                {formatColor}
                <span
                  className="bgColorIcon"
                  style={{
                    background: type === ToolType.COLOR_FILL ? fillColor : "",
                  }}
                />
              </span>
            </span>
            <span title="Text" className="tool-Icon">
              <span
                className={
                  type === ToolType.TEXT
                    ? `tool-item ${selectedToolClass}`
                    : "tool-item"
                }
                onClick={() => {
                  setType(ToolType.TEXT);
                }}
              >
                {textIcon}
              </span>
            </span>
          </>
        )}
      </ToolTypeContext.Consumer>
    </div>
  );
};

export default ToolPanel;
