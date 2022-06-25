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
//= https://bafybeiel2sxa4vbw2m43ya247ibvt7xtnzvxvb73i4gixydfhgup3f4zte.ipfs.dweb.link/orign.png"

function Paint(props: PaintProps): JSX.Element {
  const {
    id = "test",
    imgSrc,
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
  const [lineSize, setLineFontSize] = useState<number>(5);
  const [fillColor, setFillColor] = useState<string>("");
  const [activeColorType, setActiveColorType] = useState<ColorType>(
    ColorType.MAIN
  );
  const [fontStyle, setFontStyle] = useState({});
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

  const loadImage = async (imgSrc: string) => {
    const size = await getImageSize(imgSrc);
    setSize(size);
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
          setToolType(value);
          setLineFontSize(5);
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
                            <Canvas
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
