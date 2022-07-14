import React from "react";
import { useContext } from "react";
import { TextContext } from "@/context";
import "./index.less";
import { Select } from "antd";
import IntegerStep from "../components/slider";
import ColorPanel from "../components/colorPanel";
import { useMemo } from "react";

const { Option } = Select;

interface FormatColor {
  className?: string;
}

const textFamily = [
  "Barlow-ExtraBold",
  "DIN-AlternateBold",
  "Trebuchet-MSBold",
  "Trebuchet-MS",
  "Poppins-Bold",
  "Poppins-Light",
  "Poppins-Medium",
  "Poppins-Regular",
  "Poppins-SemiBold",
  "System Font",
];

const FormatColor: React.FC<FormatColor> = (props) => {
  const { className } = props;
  const TextToolContext = useContext(TextContext);

  const fontStyle = useMemo(() => {
    return TextToolContext.fontStyle;
  }, [TextToolContext.fontStyle]);

  return (
    <div
      className={
        className ? `ccc-text formatColor ${className}` : "ccc-text colorpanel"
      }
    >
      <div className="content">
        <div>
          <h3>Font</h3>
          <Select
            defaultValue="System Font"
            className="ccc-text-family"
            onChange={(value: string) => {
              TextToolContext.setFont({
                ...fontStyle,
                fontFamily: value,
              });
            }}
          >
            {textFamily.map((va) => {
              return (
                <Option key={va} value={va}>
                  {va}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="font">
          <h3>Letter Spacing</h3>
          <IntegerStep
            min={1}
            max={8}
            onPropsChange={(value) => {
              TextToolContext.setFont({
                ...fontStyle,
                letterSpacing: value + "px",
              });
            }}
          />
        </div>
        <div className="font">
          <h3>Font Size</h3>
          <IntegerStep
            min={12}
            max={720}
            value={TextToolContext?.fontStyle?.fontSize}
            onPropsChange={(value) => {
              TextToolContext.setFont({
                ...fontStyle,
                fontSize: value,
              });
            }}
          />
        </div>
        <div className="font">
          <h3>Line Height</h3>
          <IntegerStep
            min={24}
            max={56}
            onPropsChange={(value) => {
              TextToolContext.setFont({
                ...fontStyle,
                lineHeight: value + "px",
              });
            }}
          />
        </div>
        <div className="material-color-box">
          <ColorPanel
            type="text"
            className="toolbar-item"
            onChange={(color: string) => {
              TextToolContext.setFont({
                ...fontStyle,
                color: color,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormatColor;