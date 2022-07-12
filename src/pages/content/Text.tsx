import Sider from "../../components/sliderCard";
import { Select } from "antd";
import ColorPicker from "../../components/colorPicker";
import { CanvasText } from "@/tool";
import { strawState } from "../../type";

const { Option } = Select;

const textFamily = [
  "Barlow-ExtraBold",
  "DIN-AlternateBold",
  "Trebuchet-MSBold",
  "Trebuchet-MS",
  "Poppins-Bold",
  "Poppins-Light",
  "Poppins-Medium",
  "Poppins-Regular",
  "Poppins-SemiBold",
];

const Text = (props: { straw: strawState }) => {
  const { straw } = props;
  const handleChange = (type: string, value: string | number) => {
    CanvasText.changeTextStyle(type, value);
  };

  return (
    <div className="text">
      <div>
        <h3>Font</h3>
        <Select
          style={{ width: "100%" }}
          onChange={(value) => handleChange("fontFamily", value)}
        >
          {textFamily.map((va) => {
            return (
              <Option key={va} value={va}>
                {va}
              </Option>
            );
          })}
        </Select>
      </div>
      <div className="font">
        <Sider
          title="Font Size"
          options={{ max: 720, min: 12 }}
          defaultValue={72}
          onChange={(value: number) => handleChange("fontSize", value)}
        />
      </div>
      <div className="font">
        <Sider
          title="Line Height"
          options={{ max: 56, min: 24 }}
          onChange={(value: number) => handleChange("lineHeight", value)}
        />
      </div>
      <ColorPicker
        straw={straw}
        color={"#000"}
        onChange={(color: string) => handleChange("fill", color)}
      />
    </div>
  );
};

export default Text;
