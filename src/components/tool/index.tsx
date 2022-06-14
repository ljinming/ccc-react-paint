import React from "react";
import FormatColorFillTwoTone from "@material-ui/icons/FormatColorFillTwoTone";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import { ToolType } from "../../util/toolType";
import { ToolTypeContext } from "@/context";
import "./index.less";
import eraser from "@/icon/eraser.svg";
import shape from "@/icon/shape.svg";
import pen from "@/icon/pen.svg";
import ColorFillTwo from "@/icon/ColorFillTwo.svg";
const selectedToolClass = "selected-tool";

export interface ToolPanelProps {
  className?: string;
}

const ToolPanel: React.FC<ToolPanelProps> = (props) => {
  const { className } = props;
  return (
    <div className={className ? `toolpanel ${className}` : "toolpanel"}>
      <ToolTypeContext.Consumer>
        {({ type, setType }) => (
          <>
            <span title="铅笔" className="tool-Icon">
              <img
                src={pen}
                className={type === ToolType.PEN ? `tool-item ${selectedToolClass}` : "tool-item"}
                onClick={() => {
                  setType(ToolType.PEN);
                }}
              />
            </span>
            <span title="橡皮擦" className="tool-Icon">
              <img
                src={eraser}
                className={type === ToolType.ERASER ? `tool-item ${selectedToolClass}` : "tool-item"}
                onClick={() => {
                  setType(ToolType.ERASER);
                }}
              />
            </span>
            <span title="填充" className="tool-Icon">
              <FormatColorFillTwoTone
                className={type === ToolType.COLOR_FILL ? `tool-item ${selectedToolClass}` : "tool-item"}
                onClick={() => {
                  setType(ToolType.COLOR_FILL);
                }}
              />
            </span>
            <span title="形状" className="tool-Icon">
              <img
                src={shape}
                className={type === ToolType.SHAPE ? `tool-item ${selectedToolClass}` : "tool-item"}
                onClick={() => {
                  setType(ToolType.SHAPE);
                }}
              />
            </span>
            {/* <span title="颜色选取器" className="tool-Icon">
              <ColorizeTwoToneIcon
                className={type === ToolType.COLOR_EXTRACT ? `tool-item ${selectedToolClass}` : "tool-item"}
                onClick={() => {
                  setType(ToolType.COLOR_EXTRACT);
                }}
              />
            </span>{" "} */}

            <span title="文字" className="tool-Icon">
              <TextFieldsIcon
                className={type === ToolType.TEXT ? `tool-item ${selectedToolClass}` : "tool-item"}
                onClick={() => {
                  setType(ToolType.TEXT);
                }}
              />
            </span>
            {/* <span title="放大镜">
                                    <SearchTwoToneIcon className={type === ToolType.MAGNIFYING ? `tool-item ${selectedToolClass}` : "tool-item"} onClick={() => {setType(ToolType.MAGNIFYING)}} />
                                </span>  */}
          </>
        )}
      </ToolTypeContext.Consumer>
    </div>
  );
};

export default ToolPanel;
