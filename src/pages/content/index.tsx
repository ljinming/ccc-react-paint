import { connect, useSelector, shallowEqual } from "react-redux";
import ToolType from "./ToolType";
import "./index.less";
import FabricJSCanvas from "./canvas";
import { RootState } from "../../type";
import Pencil from "./Pencil";
import Shape from "./Shape";
import Eraser from "./Eraser";
import Text from "./Text";
import FillColor from "./FillColor";
import { useState } from "react";
interface ContentProps {
  pre: string;
  //tool: string;
  backgroundColor: string;
  imgSrc?: string;
  canvasSize: {
    width: number;
    height: number;
  };
  // straw : {
  //   strawFlag: boolean;
  //   strawColor: string;
  // };
}

const Content = (props: ContentProps) => {
  const { pre, imgSrc, backgroundColor, canvasSize } = props;
  //const [fillColor, setFillColor] = useState(board.fillColor);
  const tool = "PEN";
  const straw: {
    strawFlag: boolean;
    strawColor: string;
  } = {
    strawFlag: false,
    strawColor: "",
  };
  // const { tool, straw } = useSelector((state: RootState) => {
  //   return {
  //     tool: state.paint.tool.select,
  //     straw: state.paint.straw,
  //   };
  // }, shallowEqual);

  const renderRight = () => {
    let right = <>test</>;
    switch (tool) {
      case "PEN":
        return <Pencil />;
      // case "SHAPE":
      //   return <Shape />;
      // case "ERASER":
      //   return <Eraser />;
      // case "TEXT":
      //   return <Text />;
      // case "BUCKET":
      //   return <FillColor />;
      default:
        break;
    }
    return right;
  };

  return (
    <div className={`${pre}-content`}>
      <ToolType prefix={`${pre}-content`} select={tool} />
      <div className={`${pre}-content-canvas`}>
        <FabricJSCanvas
          canvasSize={canvasSize}
          tool={tool}
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

// function mapStateToProps(state: RootState) {
//   return {
//     tool: state.paint.tool.select,
//     straw: state.paint.straw,
//   };
// }

// export default connect(mapStateToProps)(Content);

export default Content;
