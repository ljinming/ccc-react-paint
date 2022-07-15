import "./index.less";
import { Slider } from "antd";

import React, { useEffect, useState } from "react";

interface IntegerStepProps {
  min?: number;
  max?: number;
  onPropsChange?: (value: any) => void;
  value?: number;
}

const IntegerStep = (props: IntegerStepProps) => {
  const { min = 1, max = 8, value = 1, onPropsChange } = props;
  const [inputValue, setInputValue] = useState(value);
  const handleChange = (newValue?: number) => {
    if (onPropsChange) {
      onPropsChange(newValue);
    }
    if (typeof newValue === "number") {
      setInputValue(newValue);
    }
  };
  /*  */

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="slider">
      <Slider
        className="ccc-slider-step"
        min={min}
        max={max}
        onChange={handleChange}
        value={inputValue}
      />
      <span style={{ marginLeft: 6 }}>max:{max}</span>
    </div>
  );
};

export default IntegerStep;
