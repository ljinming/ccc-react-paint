import ColorPicker from "../../components/colorPicker";
import { Bucket } from "@/tool";
import { strawState } from "../../type";

const FillColor = (props: { straw: strawState }) => {
  const { straw } = props;
  const handleChange = (value: string) => {
    Bucket.changeColor(value);
  };

  return (
    <>
      <ColorPicker
        color={"#000"}
        straw={straw}
        onChange={(color: string) => handleChange(color)}
      />
    </>
  );
};

export default FillColor;
