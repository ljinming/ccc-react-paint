import { Slider } from "antd";
import "./index.less";

interface sliderProps {
  title?: string;
  value?: number;
  options?: any;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export default (props: sliderProps) => {
  const { title, options = {}, value, defaultValue, onChange } = props;
  return (
    <div className="silderCard">
      {title && <h3>{title}</h3>}
      <div className="show-silder">
        <Slider
          className="slider-step"
          defaultValue={defaultValue || 2}
          value={value}
          {...options}
          onChange={onChange}
        />
        {options.max && <span>max :{options.max}</span>}
      </div>
    </div>
  );
};
