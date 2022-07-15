import React, { FC, useEffect } from "react";
import ShapeComponent from "../components/shape";
import ColorPanel from "../components/colorPanel";
import { DownOutlined } from "@ant-design/icons";
import IntegerStep from "../components/slider";
import { Shape } from "../../util/tool";

import "./index.less";

interface shapeType {
  lineSize: number;
  maxSize: number;
}

const showShape = (props: shapeType) => {
  const { lineSize, maxSize } = props;

  useEffect(() => {
    Shape.shapeWidth = lineSize / 2;
  }, []);
  return (
    <div className="ccc-shape">
      <div className="ccc-shape-item">
        <h3>Shape Thickness</h3>
        <IntegerStep
          min={1}
          max={Math.floor(maxSize / 2)}
          value={Shape.shapeWidth || lineSize / 2}
          onPropsChange={(value) => {
            Shape.shapeWidth = value;
          }}
        />
      </div>
      <h3 className="ccc-shape-title">
        <span>Shapes</span>
        <DownOutlined />
      </h3>
      <ShapeComponent className="toolbar-item" />
      <ColorPanel className="toolbar-item" />
    </div>
  );
};

export default showShape;
