import React from "react";
import { FC } from "react";
import Shape from "../components/shape";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ColorPanel from "../components/colorPanel";

import "./index.less";

const showShape: FC = () => {
  return (
    <div className="ccc-shape">
      <h3 className="ccc-shape-title">
        <span>Shope</span>
        <ExpandMore />
      </h3>
      <Shape className="toolbar-item" />
      <ColorPanel className="toolbar-item" />
    </div>
  );
};

export default showShape;
