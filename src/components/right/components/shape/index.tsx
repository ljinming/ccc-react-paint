import React from "react";
import { useContext } from "react";
import { Select } from "antd";
import { ShapeOutlineContext, ShapeTypeContext, ToolTypeContext } from "@/context";
import { ShapeOutlineType, ShapeToolType, ToolType } from "../../../../util/toolType";
import "./index.less";

import shape_line from "@/icon/shape_line.svg";
import shape_rect from "@/icon/shape_rect.svg";
import shape_circle from "@/icon/shape_circle.svg";
import shape_rhombus from "@/icon/shape_rhombus.svg";
import shape_triangle from "@/icon/shape_triangle.svg";
import shape_pentagon from "@/icon/shape_pentagon.svg";
import shape_sexangle from "@/icon/shape_sexangle.svg";
import shape_arrowtop from "@/icon/shape_arrowtop.svg";
import shape_arrowright from "@/icon/shape_arrowright.svg";
import shape_arrowdown from "@/icon/shape_arrowdown.svg";
import shape_arrowleft from "@/icon/shape_arrowleft.svg";
import shape_fourstar from "@/icon/shape_fourstar.svg";
const selectedShapeClass = "selected-shape";

const shapes = [
  {
    type: ShapeToolType.LINE,
    img: shape_line,
    title: "直线"
  },
  {
    type: ShapeToolType.RECT,
    img: shape_rect,
    title: "矩形"
  },
  {
    type: ShapeToolType.CIRCLE,
    img: shape_circle,
    title: "圆（椭圆）"
  },
  {
    type: ShapeToolType.RHOMBUS,
    img: shape_rhombus,
    title: "菱形"
  },
  {
    type: ShapeToolType.TRIANGLE,
    img: shape_triangle,
    title: "三角形"
  },
  {
    type: ShapeToolType.PENTAGON,
    img: shape_pentagon,
    title: "五边形"
  },
  {
    type: ShapeToolType.SEXANGLE,
    img: shape_sexangle,
    title: "六边形"
  },
  {
    type: ShapeToolType.ARROW_TOP,
    img: shape_arrowtop,
    title: "上箭头"
  },
  {
    type: ShapeToolType.ARROW_RIGHT,
    img: shape_arrowright,
    title: "右箭头"
  },
  {
    type: ShapeToolType.ARROW_DOWN,
    img: shape_arrowdown,
    title: "下箭头"
  },
  {
    type: ShapeToolType.ARROW_LEFT,
    img: shape_arrowleft,
    title: "左箭头"
  },
  {
    type: ShapeToolType.FOUR_STAR,
    img: shape_fourstar,
    title: "四角星"
  }
];
interface ShapePanelProps {
  className?: string;
}

const ShapePanel: React.FC<ShapePanelProps> = (props) => {
  const { className } = props;
  const toolTypeContex = useContext(ToolTypeContext);
  const shapeOutlineContext = useContext(ShapeOutlineContext);

  return (
    <div className={className ? `shapepanel ${className}` : "shapepanel"}>
      <div className="shape-container">
        <div className="shape-style">
          <Select
            style={{ width: "100%" }}
            value={shapeOutlineContext.type}
            onChange={(value) => shapeOutlineContext.setType(value as ShapeOutlineType)}
          >
            <Select.Option value={ShapeOutlineType.SOLID}>实线</Select.Option>
            <Select.Option value={ShapeOutlineType.DOTTED}>虚线</Select.Option>
          </Select>
        </div>
        <div className="shape-content">
          <ShapeTypeContext.Consumer>
            {({ type, setType }) =>
              shapes.map((shape) => (
                <img
                  src={shape.img}
                  key={shape.img}
                  title={shape.title}
                  className={
                    type === shape.type && toolTypeContex.type === ToolType.SHAPE
                      ? `shape-item ${selectedShapeClass}`
                      : "shape-item"
                  }
                  onClick={() => setType(shape.type)}
                />
              ))
            }
          </ShapeTypeContext.Consumer>
        </div>
      </div>
    </div>
  );
};

export default ShapePanel;
