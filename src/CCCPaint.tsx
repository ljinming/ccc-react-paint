import React from "react";
import Canvas from "./components/canvas";
import {
  ToolTypeContext,
  ShapeTypeContext,
  ShapeOutlineContext,
  LineWidthContext,
  ColorContext,
  FillContext,
  TextContext,
  DispatcherContext
} from "./context";
import "./style.less";
import { useState } from "react";
import { ColorType, LineWidthType, ShapeOutlineType, ShapeToolType, ToolType } from "./util/toolType";
import ToolPanel from "./components/toolBar/tool";
import Dispatcher from "./util/dispatcher";
import Right from "./components/toolBar/right";
import Edit from "./components/edit";

interface PaintProps {
  imgSrc?: string;
  width?: number;
  height?: number;
  onClick?: (type: any) => void;
}

function Paint(props: PaintProps): JSX.Element {
  const { imgSrc, width, height, onClick } = props;
  const [toolType, setToolType] = useState<ToolType>(ToolType.PEN);
  const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE);
  const [shapeOutlineType, setShapeOutlineType] = useState<ShapeOutlineType>(ShapeOutlineType.SOLID);
  const [lineWidthType, setLineWidthType] = useState<LineWidthType>(LineWidthType.LINESIZE);
  const [lineSize, setLineFontSize] = useState<number>(1);
  const [fillColor, setFillColor] = useState<string>("");
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
                        <Edit />
                      </div>
                      <div className="ccc-content">
                        <div className="ToolPanel">
                          <ToolPanel className="toolbar-item" />
                        </div>
                        <div className="show-Canvas">
                          <Canvas
                            imgSrc={imgSrc}
                            onClick={onClick}
                            CanvasWidth={width}
                            CanvasHeight={height}
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
              </ColorContext.Provider>
            </DispatcherContext.Provider>
          </LineWidthContext.Provider>
        </ShapeOutlineContext.Provider>
      </ShapeTypeContext.Provider>
    </ToolTypeContext.Provider>
  );
}

export default Paint;
