import { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { toHexString } from "../../tool/colorChange";
import "./index.less";
import { getToolIcon } from "../../pages/utils/tool";
//import Action from "@/action";
import { connect, useSelector, shallowEqual } from "react-redux";
import { RootState, StrawState } from "../../type";
import { Tool } from "@/tool";
import { store } from "../../Action";

interface ColorProps {
  color: string;
  onChange: (color: string) => void;
  //straw: StrawState;
}

const ColorPicker = (props: ColorProps) => {
  const { color, onChange } = props;
  const [showColor, setColor] = useState(color);

  const { straw } = useSelector((state: RootState) => {
    return {
      straw: state["paint.straw"],
    };
  }, shallowEqual);

  const handleChange = (color: any, event: any) => {
    if (Tool.strawColor !== "") {
      Tool.strawColor = "";
    }
    const hexColor: string = toHexString(color.rgb);
    setColor(hexColor);
    onChange(hexColor);
  };

  useEffect(() => {
    setColor(straw.strawColor);
  }, [straw.strawColor]);

  useEffect(() => {
    setColor(color);
  }, [color]);

  return (
    <div className="colorBox">
      <h3>Color</h3>
      <SketchPicker
        className="colorBox-picker"
        width="100%"
        disableAlpha={false}
        color={showColor}
        onChange={handleChange}
      />
      <span
        className={`straw-color ${straw.strawFlag ? "selected-straw" : ""}`}
        onClick={() => {
          Tool.strawFlag = true;
          store.dispatch({
            type: "paint.straw",
            payload: { strawColor: color, strawFlag: true },
          });
          // Action.emit("paint.straw", {
          //   strawFlag: true,
          // });
        }}
      >
        {getToolIcon("strawIcon")}
      </span>
    </div>
  );
};
function mapStateToProps(state: RootState) {
  return {
    straw: state.paint.straw,
  };
}

//export default connect(mapStateToProps)(ColorPicker);

export default ColorPicker;
