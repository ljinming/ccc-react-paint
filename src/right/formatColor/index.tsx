import React from "react";
import { useContext } from "react";
import { FillContext } from "@/context";
import { ColorBox, createColor } from "material-ui-color";
import "./index.less";
import { useState } from "react";
import { useEffect } from "react";
import ColorPanel from "../components/colorPanel";
interface FormatColor {
  className?: string;
}

const FormatColor: React.FC<FormatColor> = (props) => {
  const { className } = props;
  const [pickerColor, setPickerColor] = useState(createColor("#000000FF"));
  const FillColorContext = useContext(FillContext);
  //   const activeColorType = colorContext.activeColor;

  useEffect(() => {
    FillColorContext.setFillColor(`#${pickerColor.hex}`);
  }, [pickerColor]);

  return (
    <div className={className ? `formatColor ${className}` : "colorpanel"}>
      <div className="content">
        <ColorPanel
          className="toolbar-item"
          onChange={(color: string) => {
            FillColorContext.setFillColor(color);
          }}
        />
      </div>
    </div>
  );
};

export default FormatColor;
