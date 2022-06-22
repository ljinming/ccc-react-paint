import React from "react";
import { useContext } from "react";
import { ColorContext, ToolTypeContext } from "@/context";
import { ColorBox, createColor } from "material-ui-color";
import {
  Pen,
  Tool,
  Eraser,
  ColorExtract,
  ColorFill,
  Text,
} from "../../../util/tool";

import { ToolType } from "../../../util/toolType";

import "./index.less";
import { useState } from "react";
import { useEffect } from "react";
import { getRandomColor } from "../../../utils";
import { strawIcon } from "../../../ToolTypeIcon";

interface ColorPanelProps {
  className?: string;
  testTool?: Tool;
  type?: string;
  onChange?: (color: string) => void;
}

const activeColorTypeCls = "active-color-type";

const ColorPanel: React.FC<ColorPanelProps> = (props) => {
  const { className, type, onChange, testTool } = props;
  const [flag, setFlag] = useState(false);
  const [pickerColor, setPickerColor] = useState(
    createColor(type && type === "pen" ? getRandomColor() : "#000000FF")
  );
  const colorContext = useContext(ColorContext);

  useEffect(() => {
    colorContext.setColor(`#${pickerColor.hex}`);
  }, [pickerColor, testTool]);

  const getStrawColor = () => {
    const startTime = new Date().getTime();
    const intervalId = setInterval(function () {
      const endTime = new Date().getTime();
      if (Math.abs(endTime - startTime) >= 10 * 60 * 1000) {
        clearInterval(intervalId); //清除定时器 ,超过10分钟没有吸色功能 清楚定时器
      }
      if (Tool.strawColor) {
        setPickerColor(createColor(Tool.strawColor));
        clearInterval(intervalId); //清除定时器
      }
    }, 200);
  };

  return (
    <div className={className ? `colorpanel ${className}` : "colorpanel"}>
      <div className="content">
        <h3>Color</h3>
        <div className="material-color-box">
          <ColorBox
            value={pickerColor}
            disableAlpha={false}
            onChange={(color) => {
              setPickerColor(color);
              Tool.strawColor = "";
              if (onChange) {
                onChange(`#${color.hex}`);
              }
            }}
          />
          <span
            className={`straw-color ${Tool.strawFlag ? "select-item" : ""}`}
            onClick={() => {
              setFlag(!setFlag);
              Tool.strawFlag = true;
              getStrawColor();
            }}
          >
            {strawIcon}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorPanel;
