import React, { useEffect } from "react";
import "./index.less";
import { ToolType } from "../../../util/toolType";
import { FC } from "react";
import ShowPen from "./pen";
import ShowShape from "./shape";

interface ToolbarProps {
  toolType: ToolType;
}

const Toolbar: FC<ToolbarProps> = (props) => {
  const { toolType } = props;
  console.log("====4", toolType, ToolType.SHAPE);
  useEffect(() => {
    renderChild();
  }, [toolType]);

  const renderChild = (): any => {
    let content = null;
    switch (toolType) {
      case ToolType.PEN:
        content = <ShowPen />;
        // setTool(new Pen());
        break;
      case ToolType.SHAPE:
        content = <ShowShape />;
        // setTool(new Eraser());
        break;
      case ToolType.ERASER:
        // setTool(new Eraser());
        break;
      case ToolType.COLOR_EXTRACT:
        // setTool(new ColorExtract(setColor));
        break;
      case ToolType.COLOR_FILL:
        // setTool(new ColorFill());
        break;
      case ToolType.SHAPE:
        //  setTool(new Shape(shapeType, shapeOutlineType === ShapeOutlineType.DOTTED));
        break;
      default:
        break;
    }
    return content;
  };

  return (
    <div className="ccc-showTool">
      {renderChild()}
      {/* <Divider className="divider" orientation="vertical" flexItem />
            <ShapePanel className="toolbar-item" />
            <Divider className="divider" orientation="vertical" flexItem />
            <ThickSelector className="toolbar-item" />
            <Divider className="divider" orientation="vertical" flexItem />
            <ColorPanel className="toolbar-item" />
            <Divider className="divider" orientation="vertical" flexItem />
            <OtherOperator />
            <Divider className="divider" orientation="vertical" flexItem /> */}
    </div>
  );
};

export default Toolbar;
