import React from "react";
import { useContext } from "react";
import { Select } from "antd";
import {
  ShapeOutlineContext,
  ShapeTypeContext,
  ToolTypeContext,
} from "@/context";
import {
  ShapeOutlineType,
  ShapeToolType,
  ToolType,
} from "../../../util/toolType";
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
    title: "Line",
  },
  {
    type: ShapeToolType.RECT,
    img: shape_rect,
    title: "Rectangle",
  },
  {
    type: ShapeToolType.CIRCLE,
    img: shape_circle,
    title: "Oval",
  },
  {
    type: ShapeToolType.RHOMBUS,
    img: shape_rhombus,
    title: "Decision",
  },
  {
    type: ShapeToolType.TRIANGLE,
    img: shape_triangle,
    title: "Triangle",
  },
  {
    type: ShapeToolType.PENTAGON,
    img: shape_pentagon,
    title: "Regular Pentagon",
  },
  {
    type: ShapeToolType.SEXANGLE,
    img: shape_sexangle,
    title: "Hexagon",
  },
  {
    type: ShapeToolType.ARROW_TOP,
    img: shape_arrowtop,
    title: "Up Arrow",
  },
  {
    type: ShapeToolType.ARROW_RIGHT,
    img: shape_arrowright,
    title: "Right Arrow",
  },
  {
    type: ShapeToolType.ARROW_DOWN,
    img: shape_arrowdown,
    title: "Down Arrow",
  },
  {
    type: ShapeToolType.ARROW_LEFT,
    img: shape_arrowleft,
    title: "Left Arrow",
  },
  {
    type: ShapeToolType.FOUR_STAR,
    img: shape_fourstar,
    title: "4-Point Star",
  },
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
            onChange={(value) =>
              shapeOutlineContext.setType(value as ShapeOutlineType)
            }
          >
            <Select.Option value={ShapeOutlineType.SOLID}>
              Solid Line
            </Select.Option>
            <Select.Option value={ShapeOutlineType.DOTTED}>
              Dotted Line
            </Select.Option>
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
                    type === shape.type &&
                    toolTypeContex.type === ToolType.SHAPE
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
