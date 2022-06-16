import React, { FC } from "react";
import Shape from "../components/shape";
import ColorPanel from "../components/colorPanel";
import { DownOutlined } from "@ant-design/icons";

import "./index.less";

const showShape: FC = () => {
  return (
    <div className="ccc-shape">
      <h3 className="ccc-shape-title">
        <span>Shapes</span>
        <DownOutlined />
      </h3>
      <Shape className="toolbar-item" />
      <ColorPanel className="toolbar-item" />
    </div>
  );
};

export default showShape;
