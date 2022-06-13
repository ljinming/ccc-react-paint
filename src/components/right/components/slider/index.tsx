//import Slider from "@material-ui/core/Slider";
import "./index.less";
import { Slider } from "antd";

import React, { useState } from "react";

interface IntegerStepProps {
  min?: number;
  max?: number;
  onPropsChange?: (value: any) => void;
}

const IntegerStep = (props: IntegerStepProps) => {
  const { min = 1, max = 8, onPropsChange } = props;
  const [inputValue, setInputValue] = useState(1);

  const handleChange = (newValue?: number) => {
    if (onPropsChange) {
      onPropsChange(newValue);
    }
    if (typeof newValue === "number") {
      setInputValue(newValue);
    }
  }; /*  */

  return (
    <div className="slider">
      <Slider
        className="slider-step"
        min={min}
        max={max}
        onChange={handleChange}
        value={typeof inputValue === "number" ? inputValue : 0}
      />
      <span style={{ marginLeft: 6 }}>max:{max}</span>
    </div>
  );
};

export default IntegerStep;
