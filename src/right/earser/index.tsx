import React, { FC } from "react";
import { useContext } from "react";
import { LineWidthContext } from "@/context";
import IntegerStep from "../components/slider";
import "./index.less";

interface earserType {
  lineSize: number;
  maxSize: number;
}

const Eraser = (props: earserType) => {
  const { lineSize, maxSize } = props;
  const lineWidthContext = useContext(LineWidthContext);

  return (
    <div className="ccc-pen">
      <div className="ccc-slider-item">
        <h3>Eraser Thickness</h3>
        <IntegerStep
          min={1}
          max={maxSize}
          value={lineSize}
          onPropsChange={(value) => {
            lineWidthContext.setLineSize(value);
          }}
        />
      </div>
    </div>
  );
};

export default Eraser;
