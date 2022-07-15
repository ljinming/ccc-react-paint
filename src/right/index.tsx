import React from "react";
import "./index.less";
import { ToolType } from "../util/toolType";
import { FC } from "react";
import ShowPen from "./pen";
import ShowShape from "./showShape";
import FormatColor from "./formatColor";
import Text from "./text";
import Eraser from "./earser";
interface ToolbarProps {
  toolType: ToolType;
  lineSize: number;
  ThumbSrc?: string | undefined;
  maxSize?: number;
}

const ToolRightBar: FC<ToolbarProps> = (props) => {
  const { toolType, lineSize, maxSize = 100, ThumbSrc } = props;
  const renderChild = (): any => {
    let content = null;
    switch (toolType) {
      case ToolType.PEN:
        content = <ShowPen lineSize={lineSize} maxSize={maxSize} />;
        break;
      case ToolType.SHAPE:
        content = <ShowShape lineSize={lineSize} maxSize={maxSize} />;
        break;
      case ToolType.ERASER:
        content = <Eraser lineSize={lineSize} maxSize={maxSize} />;
        break;
      case ToolType.TEXT:
        content = <Text maxSize={maxSize} />;
        break;
      case ToolType.COLOR_FILL:
        content = <FormatColor />;
        break;
      default:
        break;
    }
    return content;
  };

  return (
    <div className="ccc-showTool">
      {ThumbSrc && <img src={ThumbSrc} className="ThumbSrc" />}
      {renderChild()}
    </div>
  );
};

export default React.memo(ToolRightBar);
