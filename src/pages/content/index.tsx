import ToolType from "./ToolType";
import "./index.less";
import FabricJSCanvas from "./canvas";
import Pencil from "./Pencil";
import Shape from "./Shape";
import Eraser from "./Eraser";
import Text from "./Text";
import FillColor from "./FillColor";
interface ContentProps {
  pre: string;
  //tool: string;
  backgroundColor: string;
  imgSrc?: string;
  select: string;
  canvasSize: {
    width: number;
    height: number;
  };
  straw: {
    strawFlag: boolean;
    strawColor: string;
  };
}

const Content = (props: ContentProps) => {
  const { pre, imgSrc, select, backgroundColor, straw, canvasSize } = props;

  const renderRight = () => {
    let right;
    switch (select) {
      case "PEN":
        return <Pencil straw={straw} />;
      case "SHAPE":
        return <Shape straw={straw} />;
      case "ERASER":
        return <Eraser />;
      case "TEXT":
        return <Text straw={straw} />;
      case "BUCKET":
        return <FillColor straw={straw} />;
      default:
        break;
    }
    return right;
  };

  return (
    <div className={`${pre}-content`}>
      <ToolType prefix={`${pre}-content`} select={select} />
      <div className={`${pre}-content-canvas`}>
        <FabricJSCanvas
          canvasSize={canvasSize}
          tool={select}
          imgSrc={imgSrc}
          id="test"
          straw={straw}
          backgroundColor={backgroundColor}
        />
      </div>
      <div className={`${pre}-content-right`}>{renderRight()}</div>
    </div>
  );
};

export default Content;
