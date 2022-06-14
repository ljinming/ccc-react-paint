import React, { FC } from "react";
import { useContext } from "react";
import { LineWidthContext } from "@/context";
import IntegerStep from "../components/slider";
import ColorPanel from "../components/colorPanel";
import "./index.less";
const ShowPen: FC = () => {
  const lineWidthContext = useContext(LineWidthContext);

  return (
    <div className="ccc-pen">
      <div className="ccc-slider-item">
        <h3>Brush thickness</h3>
        <IntegerStep
          min={1}
          max={20}
          onPropsChange={(value) => {
            lineWidthContext.setLineSize(value);
          }}
        />
      </div>
      <ColorPanel className="toolbar-item" title="Color Panel" />
    </div>
  );
};

export default ShowPen;