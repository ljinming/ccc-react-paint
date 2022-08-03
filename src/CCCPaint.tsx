import React, { Ref, useEffect, useImperativeHandle } from "react";
import Canvas from "./canvas";
import { LoadingOutlined } from "@ant-design/icons";
import { Tool } from "./util/tool";
import {
  ToolTypeContext,
  ShapeTypeContext,
  ShapeOutlineContext,
  LineWidthContext,
  ColorContext,
  FillContext,
  TextContext,
  DispatcherContext,
} from "./context";
import "./style.less";
import { useState } from "react";
import {
  ColorType,
  LineWidthType,
  ShapeOutlineType,
  ShapeToolType,
  ToolType,
} from "./util/toolType";
import ToolPanel from "./left-tool";
import Dispatcher from "./util/dispatcher";
import Right from "./right";
import Edit from "./edit";
import { getImageSize } from "./utils";
import { getMousePos } from "./util/tool/tool";
import PiexCanvas from "./piexCanvas";
import { Button } from "antd";

interface PaintProps {
  imgSrc?: string;
  width?: number;
  height?: number;
  background?: string;
  id?: string;
  cRef?: any;
  ThumbSrc?: string;
  showArea?: Array<[number, number]>;
}
//= https://bafybeibsrvi7eb2eibdkr73e2d3znucfpbkvml2jsbgt7cctdk7m4p2fi4.ipfs.dweb.link/orign.png
//"https://bafybeicgvg3vwtv5c633cjexbykjp75yjt755qhma4o7vgusa4ldvocz44.ipfs.dweb.link/orign.png"
//https://bafybeifgfvlt6qhz5b2gb4t35pzalywvzxm7qmlj3d4vpmcwq7vmqtqtdu.ipfs.dweb.link/orign.png

function Paint(props: PaintProps): JSX.Element {
  const {
    id = "test",
    imgSrc = "https://iwnuo-oqaaa-aaaah-qcwcq-cai.raw.ic0.app/thumbnail/231",
    width = 0,
    height = 0,
    background,
    cRef,
    showArea,
    ThumbSrc,
  } = props;

  const [toolType, setToolType] = useState<ToolType>(ToolType.PEN);
  const [strawType, setStrawType] = useState<boolean>(false);
  const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE);
  const [size, setSize] = useState({ width, height });
  const [Thumbnail, setThumbnail] = useState(ThumbSrc);
  const [loadings, setLoadings] = useState(true);

  const [shapeOutlineType, setShapeOutlineType] = useState<ShapeOutlineType>(
    ShapeOutlineType.SOLID
  );
  const [lineWidthType, setLineWidthType] = useState<LineWidthType>(
    LineWidthType.LINESIZE
  );
  const [lineSize, setLineFontSize] = useState<number>(1);
  const [fillColor, setFillColor] = useState<string>("");
  const [activeColorType, setActiveColorType] = useState<ColorType>(
    ColorType.MAIN
  );
  const [fontStyle, setFontStyle] = useState({
    fontSize: 72,
    fontFamily: "System Font",
  });
  const [mainColor, setMainColor] = useState<string>("black");
  const [subColor, setSubColor] = useState<string>("white");
  const [dispatcher] = useState(new Dispatcher());

  const setColor = (value: string) => {
    if (activeColorType === ColorType.MAIN) {
      setMainColor(value);
    } else {
      setSubColor(value);
    }
  };

  useImperativeHandle(cRef, () => ({
    getCurrentImageData: () => {
      const canvasElem: any = document.getElementById(`ccc-paint-canvas ${id}`);
      const imageData = canvasElem.toDataURL("image/png");
      return imageData;
    },
  }));

  const transformImageData2Base64 = (data: {
    imageData: ImageData;
    height: number;
    width: number;
  }): string => {
    const { imageData, height, width } = data;
    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext("2d");
    ctx?.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/jpeg", 1);
  };

  const handleClick = () => {
    const canvasElem: any = document.getElementById(`ccc-paint-canvas ${id}`);
    const imageData = canvasElem
      .getContext("2d")
      .getImageData(canvasElem.width, canvasElem.height);
    // 创建一个 a 标签，并设置 href 和 download 属性
    const el = document.createElement("a");
    // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
    const base64 = transformImageData2Base64({
      imageData,
      height,
      width,
    });

    el.href = base64;
    el.download = "文件名称";

    // 创建一个点击事件并对 a 标签进行触发
    const event = new MouseEvent("click");
    el.dispatchEvent(event);
  };

  const loadImage = async (imgSrc: string) => {
    const size = await getImageSize(imgSrc);
    setSize(size);
    setLineFontSize(Math.floor(size.width / 100));
    setLoadings(false);
  };

  useEffect(() => {
    // 再一次进入
    if (imgSrc) {
      loadImage(imgSrc);
    } else if (width && height) {
      setSize({ width, height });
      setLoadings(false);
    }
    if (!ThumbSrc) {
      // 没有area
      setThumbnail("");
      Tool.showArea = null;
    }
  }, [width, imgSrc, height]);

  if (showArea) {
    Tool.showArea = showArea;
  }
  return (
    <ToolTypeContext.Provider
      value={{
        type: toolType,
        strawType: strawType,
        setStrawType: (value) => {
          setStrawType(value);
        },
        setType: (value) => {
          if (Tool.textList && Object.keys(Tool.textList).length > 0) {
            Object.keys(Tool.textList).forEach((va) => {
              const { data, pos } = Tool.textList[va];
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = data;
              img.onload = function () {
                /*1.在canvas 中绘制图像*/
                const { x, y } = getMousePos(
                  Tool.ctx.canvas,
                  undefined,
                  undefined,
                  {
                    x: pos[0],
                    y: pos[1],
                  }
                );
                Tool.ctx.drawImage(img, x, y);
              };
              document
                .getElementById("all-canvas")
                ?.removeChild(Tool.textList[va].canvas);
            });
            Tool.textList = {};
          }
          setToolType(value);
        },
      }}
    >
      <ShapeTypeContext.Provider
        value={{
          type: shapeType,
          setType: (type: ShapeToolType) => {
            setShapeType(type);
          },
        }}
      >
        <ShapeOutlineContext.Provider
          value={{ type: shapeOutlineType, setType: setShapeOutlineType }}
        >
          <LineWidthContext.Provider
            value={{
              type: lineWidthType,
              lineSize: lineSize,
              setType: setLineWidthType,
              setLineSize: setLineFontSize,
            }}
          >
            <DispatcherContext.Provider value={{ dispatcher }}>
              <ColorContext.Provider
                value={{
                  mainColor,
                  subColor,
                  activeColor: activeColorType,
                  setColor,
                  setActiveColor: setActiveColorType,
                }}
              >
                <FillContext.Provider
                  value={{
                    fillColor,
                    setFillColor,
                  }}
                >
                  <TextContext.Provider
                    value={{
                      fontStyle,
                      setFont: setFontStyle,
                    }}
                  >
                    <div className="ccc">
                      <div className="ccc-edit">
                        <Edit />
                        <Button onClick={handleClick}>保存</Button>
                      </div>
                      <div className="ccc-content">
                        <div className="ToolPanel">
                          <ToolPanel
                            className="toolbar-item"
                            fillColor={fillColor}
                          />
                        </div>
                        {loadings ? (
                          <div className="show-loading">
                            <LoadingOutlined className="loading-size" />
                          </div>
                        ) : (
                          <div className="show-Canvas">
                            <PiexCanvas
                              id={id}
                              strawType={strawType}
                              CanvasSize={size}
                              imgSrc={imgSrc}
                              background={background}
                              fillColor={fillColor}
                              toolType={toolType}
                              fontStyle={fontStyle}
                              shapeType={shapeType}
                              shapeOutlineType={shapeOutlineType}
                              mainColor={mainColor}
                              subColor={subColor}
                              lineSize={lineSize}
                              lineWidthType={lineWidthType}
                              setColor={setColor}
                            />
                          </div>
                        )}
                        <div className="show-type">
                          <Right
                            toolType={toolType}
                            ThumbSrc={Thumbnail}
                            lineSize={lineSize}
                            maxSize={Math.floor(size.width / 10)}
                          />
                        </div>
                      </div>
                    </div>
                  </TextContext.Provider>
                </FillContext.Provider>
              </ColorContext.Provider>
            </DispatcherContext.Provider>
          </LineWidthContext.Provider>
        </ShapeOutlineContext.Provider>
      </ShapeTypeContext.Provider>
    </ToolTypeContext.Provider>
  );
}

export default Paint;
