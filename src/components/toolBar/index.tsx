import React from "react";
import "./index.less";
import ToolPanel from "./tool"; //工具
import ShapePanel from "./shape"; // 图形
import Divider from "@material-ui/core/Divider";
import ThickSelector from "./thickSelector"; //粗细
import ColorPanel from "./colorPanel"; //颜色
import OtherOperator from "./other"; //操作

const Toolbar = (): JSX.Element => {
  return (
    <div className="toolbar">
      <ToolPanel className="toolbar-item" />
      <Divider className="divider" orientation="vertical" flexItem />
      <ShapePanel className="toolbar-item" />
      <Divider className="divider" orientation="vertical" flexItem />
      <ThickSelector className="toolbar-item" />
      <Divider className="divider" orientation="vertical" flexItem />
      <ColorPanel className="toolbar-item" />
      <Divider className="divider" orientation="vertical" flexItem />
      <OtherOperator />
      <Divider className="divider" orientation="vertical" flexItem />
    </div>
  );
};

export default Toolbar;
