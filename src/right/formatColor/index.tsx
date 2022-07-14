import React from "react";
import { useContext } from "react";
import { FillContext } from "@/context";
import "./index.less";
import ColorPanel from "../components/colorPanel";
interface FormatColor {
  className?: string;
}

const FormatColor: React.FC<FormatColor> = (props) => {
  const { className } = props;
  const FillColorContext = useContext(FillContext);

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
