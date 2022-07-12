import { Select } from "antd";
import shape_line from "@/assets/icon/shape_line.svg";
import shape_rect from "@/assets/icon/shape_rect.svg";
import shape_circle from "@/assets/icon/shape_circle.svg";
//import shape_rhombus from "@/assets/icon/shape_rhombus.svg";
import shape_triangle from "@/assets/icon/shape_triangle.svg";
//import shape_pentagon from "@/assets/icon/shape_pentagon.svg";
import shape_sexangle from "@/assets/icon/shape_sexangle.svg";
// import shape_arrowtop from "@/assets/icon/shape_arrowtop.svg";
// import shape_arrowright from "@/assets/icon/shape_arrowright.svg";
// import shape_arrowdown from "@/assets/icon/shape_arrowdown.svg";
// import shape_arrowleft from "@/assets/icon/shape_arrowleft.svg";
// import shape_fourstar from "@/assets/icon/shape_fourstar.svg";
import ColorPicker from "../../components/colorPicker";
import { useState } from "react";
import { Shape } from "@/tool";

const ShapeRight = () => {
  const [showValue, setShow] = useState("LINE");

  const handleChange = (type: string, value: string) => {
    Shape.changeShapeType(type, value);
    if (type === "shapeType") {
      setShow(value);
    }
  };

  const shapes = [
    {
      type: "LINE",
      img: shape_line,
      title: "Line",
    },
    {
      type: "RECT",
      img: shape_rect,
      title: "Rectangle",
    },
    {
      type: "CIRCLE",
      img: shape_circle,
      title: "Oval",
    },
    {
      type: "RHOMBUS",
      img: shape_sexangle,
      title: "Polygon",
    },
    {
      type: "TRIANGLE",
      img: shape_triangle,
      title: "Triangle",
    },
    // {
    //   type: "PENTAGON",
    //   img: shape_pentagon,
    //   title: "五边形",
    // },
    // {
    //   type: "SEXANGLE",
    //   img: shape_sexangle,
    //   title: "六边形",
    // },
    // {
    //   type: "ARROW_TOP",
    //   img: shape_arrowtop,
    //   title: "上箭头",
    // },
    // {
    //   type: "ARROW_RIGHT",
    //   img: shape_arrowright,
    //   title: "右箭头",
    // },
    // {
    //   type: "ARROW_DOWN",
    //   img: shape_arrowdown,
    //   title: "下箭头",
    // },
    // {
    //   type: "ARROW_LEFT",
    //   img: shape_arrowleft,
    //   title: "左箭头",
    // },
    // {
    //   type: "FOUR_STAR",
    //   img: shape_fourstar,
    //   title: "四角星",
    // },
  ];

  return (
    <div className="shape">
      <h3>Shape</h3>
      <Select
        style={{ width: "100%" }}
        defaultValue={"FILL"}
        onChange={(value) => handleChange("border", value)}
        // onChange={(value) => (board.shapeLine = value)}
      >
        <Select.Option value={"SOLID"}>solid line</Select.Option>
        <Select.Option value={"DOTTED"}>dotted line</Select.Option>
        <Select.Option value={"FILL"}>fill shape</Select.Option>
      </Select>
      <div className="shape-content">
        {shapes.map((shape) => (
          <img
            src={shape.img}
            key={shape.img}
            title={shape.title}
            className={`shape-item ${
              showValue === shape.type ? "selected-shape" : ""
            }`}
            onClick={() => handleChange("shapeType", shape.type)}
            // onClick={() => {
            //   setShow(shape.type);
            //   board.setShape({ shapeType: shape.type });
            // }}
          />
        ))}
      </div>
      <ColorPicker
        color={"#000"}
        onChange={(color: string) => handleChange("color", color)}
      />
    </div>
  );
};

export default ShapeRight;
