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
}

const ToolRightBar: FC<ToolbarProps> = (props) => {
  const { toolType, lineSize } = props;

  const renderChild = (): any => {
    let content = null;
    switch (toolType) {
      case ToolType.PEN:
        content = <ShowPen lineSize={lineSize} />;
        break;
      case ToolType.SHAPE:
        content = <ShowShape />;
        break;
      case ToolType.ERASER:
        content = <Eraser lineSize={lineSize} />;
        break;
      case ToolType.TEXT:
        content = <Text />;
        break;
      case ToolType.COLOR_FILL:
        content = <FormatColor />;
        break;
      default:
        break;
    }
    return content;
  };

  return <div className="ccc-showTool">{renderChild()}</div>;
};

export default React.memo(ToolRightBar);
