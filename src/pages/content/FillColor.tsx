import ColorPicker from "../../components/colorPicker";
import { Bucket } from "@/tool";

const FillColor = () => {
  const handleChange = (value: string) => {
    Bucket.changeColor(value);
  };

  return (
    <>
      <ColorPicker
        color={"#000"}
        onChange={(color: string) => handleChange(color)}
      />
    </>
  );
};

export default FillColor;
