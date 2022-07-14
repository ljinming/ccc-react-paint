import React from "react";
import { useContext } from "react";
import { ColorContext, ToolTypeContext } from "@/context";
import { Tool } from "../../../util/tool";
import "./index.less";
import { useState } from "react";
import { useEffect } from "react";
import { SketchPicker } from "react-color";
import { getRandomColor } from "../../../utils";
import { strawIcon } from "../../../ToolTypeIcon";
import { toHexString } from "../../../util/colorChange";

interface ColorPanelProps {
  className?: string;
  testTool?: Tool;
  color?: string;
  type?: string;
  onChange?: (color: string) => void;
}

const activeColorTypeCls = "active-color-type";

const ColorPanel: React.FC<ColorPanelProps> = (props) => {
  const { className, type, color, onChange, testTool } = props;
  const colorStr = type === "pen" ? getRandomColor() : color || "#000000FF";
  const [showColor, setColor] = useState(colorStr);
  const colorContext = useContext(ColorContext);
  const ToolContext = useContext(ToolTypeContext);

  useEffect(() => {
    colorContext.setColor(showColor);
  }, [showColor, testTool]);

  const getStrawColor = () => {
    const startTime = new Date().getTime();
    const intervalId = setInterval(function () {
      const endTime = new Date().getTime();
      if (Math.abs(endTime - startTime) >= 10 * 60 * 1000) {
        clearInterval(intervalId); //清除定时器 ,超过10分钟没有吸色功能 清楚定时器
        ToolContext.setStrawType(false);
      }
      if (Tool.strawColor) {
        setColor(Tool.strawColor);
        ToolContext.setStrawType(false);
        clearInterval(intervalId); //清除定时器
      }
    }, 200);
  };

  const handleChange = (color: any) => {
    if (Tool.strawColor !== "") {
      Tool.strawColor = "";
    }
    const hexColor: string = toHexString(color.rgb);
    setColor(hexColor);
    Tool.strawColor = "";
    // Tool.colorPicker = "";
    if (onChange) {
      onChange(hexColor);
    }
  };

  useEffect(() => {
    const nodeColor = document.getElementsByClassName(
      "ccc-paint-colorBox-picker"
    )[0];
    const fileList = nodeColor?.getElementsByClassName("flexbox-fix");
    if (fileList[0]) {
      fileList[0].setAttribute("style", "padding-left:12%;display: flex");
    }
  }, []);

  return (
    <div className={className ? `colorpanel ${className}` : "colorpanel"}>
      <div className="content">
        <h3>Color</h3>
        <div className="material-color-box">
          <SketchPicker
            className="ccc-paint-colorBox-picker"
            width="100%"
            disableAlpha={false}
            color={showColor}
            onChange={handleChange}
          />
          {type !== "text" && (
            <span
              className={`straw-color ${Tool.strawFlag ? "select-item" : ""}`}
              onClick={() => {
                Tool.strawFlag = true;
                Tool.strawColor = "";
                ToolContext.setStrawType(true);
                getStrawColor();
              }}
            >
              {strawIcon}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPanel;
