import Sider from "../../components/sliderCard";
import ColorPicker from "../../components/colorPicker";
import { Pen, Tool } from "@/tool";

const Pencil = () => {
  const handleChange = (type: string, value: number | string) => {
    Pen.setPenStyle(type, value);
  };

  return (
    <>
      <Sider
        title="Brush thickness"
        options={{ max: 200, min: 1 }}
        defaultValue={20}
        onChange={(value: number) => handleChange("lineWidth", value)}
      />
      <ColorPicker
        color={Pen.color}
        onChange={(color: string) => handleChange("color", color)}
      />
    </>
  );
};

export default Pencil;
