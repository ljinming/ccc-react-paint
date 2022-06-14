import React, { Ref, useEffect, useImperativeHandle } from "react";
import Canvas from "./canvas";
import {
  ToolTypeContext,
  ShapeTypeContext,
  ShapeOutlineContext,
  LineWidthContext,
  ColorContext,
  FillContext,
  TextContext,
  SizeContext,
  DispatcherContext
} from "./context";
import "./style.less";
import { useState } from "react";
import { ColorType, LineWidthType, ShapeOutlineType, ShapeToolType, ToolType } from "./util/toolType";
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
  onClick?: (type: any) => void;
}

function Paint(props: PaintProps): JSX.Element {
  const {
    id = "test",
    imgSrc = "https://bafybeifbtjkiisih2voul3gzzy6mswi37ym2bwoz7wczeozdjufxntl65y.ipfs.dweb.link/orign.png",
    width,
    height,
    background,
    onClick,
    cRef
  } = props;

  const [toolType, setToolType] = useState<ToolType>(ToolType.PEN);
  const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE);
  const [shapeOutlineType, setShapeOutlineType] = useState<ShapeOutlineType>(ShapeOutlineType.SOLID);
  const [lineWidthType, setLineWidthType] = useState<LineWidthType>(LineWidthType.LINESIZE);
  const [lineSize, setLineFontSize] = useState<number>(1);
  const [fillColor, setFillColor] = useState<string>("");
  const [size, setSize] = useState({ width, height });
  const [activeColorType, setActiveColorType] = useState<ColorType>(ColorType.MAIN);
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

  const loadImgSize = async () => {
    const size = await getImageSize(imgSrc);
    setSize(size);
  };

  useEffect(() => {
    if (imgSrc) {
      loadImgSize();
    } else {
      setSize({ width, height });
    }
  }, [width, height, imgSrc]);

  useImperativeHandle(cRef, () => ({
    getCurrentImageData: () => {
      const canvasElem: any = document.getElementById(`ccc-paint-canvas ${id}`);
      const imageData = canvasElem.toDataURL("image/png");
      return imageData;
    }
  }));

  return (
    <ToolTypeContext.Provider value={{ type: toolType, setType: setToolType }}>
      <ShapeTypeContext.Provider
        value={{
          type: shapeType,
          setType: (type: ShapeToolType) => {
            setToolType(ToolType.SHAPE);
            setShapeType(type);
          }
        }}
      >
        <ShapeOutlineContext.Provider value={{ type: shapeOutlineType, setType: setShapeOutlineType }}>
          <LineWidthContext.Provider
            value={{
              type: lineWidthType,
              lineSize: lineSize,
              setType: setLineWidthType,
              setLineSize: setLineFontSize
            }}
          >
            <DispatcherContext.Provider value={{ dispatcher }}>
              <ColorContext.Provider
                value={{
                  mainColor,
                  subColor,
                  activeColor: activeColorType,
                  setColor,
                  setActiveColor: setActiveColorType
                }}
              >
                <SizeContext.Provider value={{ size, onSize: setSize }}>
                  <FillContext.Provider
                    value={{
                      fillColor,
                      setFillColor
                    }}
                  >
                    <TextContext.Provider
                      value={{
                        fontStyle,
                        setFont: setFontStyle
                      }}
                    >
                      <div className="ccc">
                        <div className="ccc-edit">
                          <Edit CanvasSize={size} />
                        </div>
                        <div className="ccc-content">
                          <div className="ToolPanel">
                            <ToolPanel className="toolbar-item" fillColor={fillColor} />
                          </div>
                          <div className="show-Canvas">
                            <Canvas
                              id={id}
                              CanvasSize={size}
                              imgSrc={imgSrc}
                              background={background}
                              onSize={setSize}
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
                          <div className="show-type">
                            <Right toolType={toolType} />
                          </div>
                        </div>
                      </div>
                    </TextContext.Provider>
                  </FillContext.Provider>
                </SizeContext.Provider>
              </ColorContext.Provider>
            </DispatcherContext.Provider>
          </LineWidthContext.Provider>
        </ShapeOutlineContext.Provider>
      </ShapeTypeContext.Provider>
    </ToolTypeContext.Provider>
  );
}

export default Paint;
