import { useSelector, shallowEqual } from "react-redux";
import ToolType from "./ToolType";
import { LoadingOutlined } from "@ant-design/icons";
import "./index.less";
import FabricJSCanvas from "./canvas";
import { RootState } from "../../type";
import Pencil from "./Pencil";
import Shape from "./Shape";
import Eraser from "./Eraser";
import Text from "./Text";
import FillColor from "./FillColor";
import { useEffect, useState } from "react";
import { Tool } from "../../tool";
interface ContentProps {
  pre: string;
  //tool: string;
  backgroundColor: string;
  imgSrc?: string;
  id: string;
  width?: number;
  height?: number;
  showArea?: Array<[number, number]> | undefined;
  ThumbSrc?: string;

  // straw : {
  //   strawFlag: boolean;
  //   strawColor: string;
  // };
}

function getImageSize(url: string): Promise<{
  width: number;
  height: number;
}> {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload = function () {
      resolve({
        width: image.width,
        height: image.height,
      });
    };
    image.onerror = function () {
      reject(new Error("error"));
    };
    image.src = url;
  });
}

const Content = (props: ContentProps) => {
  const {
    pre,
    imgSrc,
    showArea,
    ThumbSrc,
    width = 0,
    height = 0,
    id,
    backgroundColor,
  } = props;
  const [size, setSize] = useState({ width, height });

  const { tool, straw } = useSelector((state: RootState) => {
    return {
      tool: state["paint.tool"].select,
      straw: state["paint.straw"],
    };
  }, shallowEqual);

  const loadImgSize = async (src: string) => {
    const size = await getImageSize(src);
    setSize(size);
  };

  useEffect(() => {
    if (imgSrc) {
      loadImgSize(imgSrc);
    } else {
      if (width && height) {
        setSize({ width, height });
      }
    }
  }, [width, height, imgSrc]);

  useEffect(() => {
    Tool.showArea = showArea;
    Tool.ThumbSrc = ThumbSrc;
  }, [showArea, ThumbSrc]);

  const renderRight = () => {
    let right = <>test</>;
    switch (tool) {
      case "PEN":
        return <Pencil />;
      case "SHAPE":
        return <Shape />;
      case "ERASER":
        return <Eraser />;
      case "TEXT":
        return <Text />;
      case "BUCKET":
        return <FillColor />;
      default:
        break;
    }
    return right;
  };

  return (
    <div className={`${pre}-content`}>
      <ToolType prefix={`${pre}-content`} select={tool} />
      {size ? (
        <div className={`${pre}-content-canvas`}>
          <FabricJSCanvas
            canvasSize={size}
            tool={tool}
            imgSrc={imgSrc}
            id={id}
            straw={straw}
            backgroundColor={backgroundColor}
          />
        </div>
      ) : (
        <div className={`${pre}-content-loading`}>
          <LoadingOutlined className="loading-size" />
        </div>
      )}

      <div className={`${pre}-content-right`}>
        {ThumbSrc && <img src={ThumbSrc} className="ThumbSrc" />}
        {renderRight()}
      </div>
    </div>
  );
};

export default Content;
