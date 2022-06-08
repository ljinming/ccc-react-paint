import React from "react";
import { useContext } from "react";
import { ColorContext } from "../../../../../context";
import { ColorType } from "../../../../../util/toolType";
import { ColorBox, createColor } from "material-ui-color";
import "./index.less";
import { useState } from "react";
import { useEffect } from "react";

interface ColorPanelProps {
  className?: string;
}

const activeColorTypeCls = "active-color-type";

const ColorPanel: React.FC<ColorPanelProps> = (props) => {
  const { className } = props;
  const [pickerColor, setPickerColor] = useState(createColor("#000000FF"));
  const colorContext = useContext(ColorContext);
  const activeColorType = colorContext.activeColor;

  useEffect(() => {
    colorContext.setColor(`#${pickerColor.hex}`);
  }, [pickerColor]);

  return (
    <div className={className ? `colorpanel ${className}` : "colorpanel"}>
      <div className="content">
        {/* <div className="color-template">
          {colors.map((color) => (
            <div
              onClick={() => colorContext.setColor(color.value)}
              key={color.value}
              className="color-template-item"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div> */}
        <div className="color-result">
          <div
            onClick={() => colorContext.setActiveColor(ColorType.MAIN)}
            className={activeColorType === ColorType.MAIN ? `main-color ${activeColorTypeCls}` : "main-color"}
          >
            <div className="color-box1" style={{ backgroundColor: colorContext.mainColor }} />
            <div>panel color</div>
          </div>
          <div
            onClick={() => colorContext.setActiveColor(ColorType.SUB)}
            className={activeColorType === ColorType.SUB ? `sub-color ${activeColorTypeCls}` : "sub-color"}
          ></div>
        </div>
        <div className="material-color-box">
          <ColorBox
            value={pickerColor}
            deferred={true}
            disableAlpha={false}
            onChange={(color) => {
              console.log("===3", color);
              setPickerColor(color);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPanel;
