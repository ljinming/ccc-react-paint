import React, { useMemo } from "react";
import "./index.less";
import { useEffect } from "react";
import { useRef } from "react";
import {
  LineWidthType,
  ShapeOutlineType,
  ShapeToolType,
  ToolType,
} from "../util/toolType";
import { FC } from "react";
import { useState } from "react";
import { Pen, Tool, Eraser, ColorExtract, ColorFill, Text } from "../util/tool";
import Shape from "../util/tool/shape";
import { useContext } from "react";
import { DispatcherContext } from "../context";
import { CLEAR_EVENT, REDO_EVENT, UNDO_EVENT } from "../util/dispatcher/event";
import SnapShot from "../util/snapshot";
import { Input } from "antd";

const { TextArea } = Input;

interface CanvasProps {
  toolType: ToolType;
  shapeType: ShapeToolType;
  shapeOutlineType: ShapeOutlineType;
  lineWidthType: LineWidthType;
  mainColor: string;
  subColor: string;
  lineSize?: number;
  fillColor: string;
  fontStyle: any;
  imgSrc?: string;
  CanvasSize: {
    width?: number;
    height?: number;
  };
  id: string;
  background?: string;
  onSize?: (value: any) => void;
  setColor: (value: string) => void;
}

let show_scale = 1;

const Canvas: FC<CanvasProps> = (props) => {
  const {
    id,
    toolType,
    lineWidthType,
    mainColor,
    subColor,
    setColor,
    CanvasSize,
    fillColor,
    shapeType,
    shapeOutlineType,
    fontStyle,
    imgSrc,
    background,
    lineSize = 1,
    onSize,
  } = props;
  const [tool, setTool] = useState<Tool>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const allCanvasRef = useRef<HTMLDivElement>(null);
  const canvasTextRef = useRef<HTMLDivElement>(null);
  const dispatcherContext = useContext(DispatcherContext);
  const [snapshot] = useState<SnapShot>(new SnapShot());
  const [scale, setScale] = useState(1);
  useEffect(() => {
    switch (toolType) {
      case ToolType.PEN:
        setTool(new Pen());
        break;
      case ToolType.ERASER:
        setTool(new Eraser(lineSize));
        break;
      case ToolType.COLOR_EXTRACT:
        setTool(new ColorExtract(setColor));
        break;
      case ToolType.COLOR_FILL:
        setTool(new ColorFill());
        break;
      case ToolType.TEXT:
        setTool(new Text(fontStyle));
        break;
      case ToolType.SHAPE:
        setTool(
          new Shape(shapeType, shapeOutlineType === ShapeOutlineType.DOTTED)
        );
        break;
      default:
        break;
    }
  }, [toolType, shapeType, fontStyle, lineSize, scale]);

  useEffect(() => {
    if (tool instanceof Shape) {
      tool.isDashed = shapeOutlineType === ShapeOutlineType.DOTTED;
    }
  }, [shapeOutlineType]);

  useEffect(() => {
    switch (lineWidthType) {
      case LineWidthType.THIN:
        Tool.lineWidthFactor = 1;
        break;
      case LineWidthType.MIDDLE:
        Tool.lineWidthFactor = 2;
        break;
      case LineWidthType.BOLD:
        Tool.lineWidthFactor = 3;
        break;
      case LineWidthType.MAXBOLD:
        Tool.lineWidthFactor = 4;
        break;
      case LineWidthType.LINESIZE:
        Tool.lineWidthFactor = lineSize;
        break;
      default:
        break;
    }
  }, [lineWidthType, lineSize]);

  useEffect(() => {
    Tool.mainColor = mainColor;
  }, [mainColor]);

  useEffect(() => {
    Tool.fillColor = fillColor;
  }, [fillColor]);

  useEffect(() => {
    Tool.subColor = subColor;
  }, [subColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = allCanvasRef.current;
    if (canvas) {
      const width = container!.clientWidth;
      const height = container!.clientHeight;
      Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const ctx = canvas.getContext("2d");
      let showScale = scale;
      if (ctx) {
        if (imgSrc) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imgSrc;
          img.onload = function () {
            canvas.height = img.height;
            canvas.width = img.width;
            /*1.在canvas 中绘制图像*/
            showScale =
              Math.min(width, height) / Math.max(img.height, img.width);
            console.log("===5", showScale);
            ctx.scale(showScale, showScale);
            //show_scale = showScale;
            const showWidth: number = img.width * showScale;
            const showHeight = img.height * showScale;
            defaultCanvas(showWidth, showHeight);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
        } else {
          ctx.fillStyle = background || "#2d2d2d";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        setScale(showScale);
      }

      // 注册清空画布事件
      const dispatcher = dispatcherContext.dispatcher;
      const callback = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (imgSrc) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imgSrc;
            img.onload = function () {
              const { width, height } = img;
              /*1.在canvas 中绘制图像*/
              ctx.drawImage(img, 0, 0);
              /*2.从canvas 中获取图像的ImageData*/
              const imgData = ctx.getImageData(0, 0, width, height);
              /*3.在canvas 中显示ImageData*/
              ctx.putImageData(
                imgData,
                //位置
                0,
                height
              );
            };
          } else {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      };
      dispatcher.on(CLEAR_EVENT, callback);

      // 注册画布前进事件
      const forward = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = snapshot.forward();
          if (imageData) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
          }
        }
      };
      dispatcher.on(REDO_EVENT, forward);

      // 注册画布后退事件
      const back = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = snapshot.back();
          if (imageData) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
          }
        }
      };
      dispatcher.on(UNDO_EVENT, back);

      const changeSize = () => {
        const canvasData = Tool.ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        // const changWidth = allCanvasRef.current?.clientWidth || width;
        // const changHeight = allCanvasRef.current?.clientHeight || height;
        //  canvasPain(Tool.ctx, changWidth, changHeight, canvasData);
      };
      window.addEventListener("resize", changeSize);

      return () => {
        dispatcher.off(CLEAR_EVENT, callback);
      };
    }
  }, [canvasRef]);

  const defaultCanvas = (width: number, height: number) => {
    const textBox = canvasTextRef.current;
    const canvas = canvasRef.current;
    if (textBox && canvas) {
      canvas.setAttribute("height", `${height}px`);
      canvas.setAttribute("width", `${width}px`);
      textBox.setAttribute("height", `${height}px`);
      textBox.setAttribute("width", `${width}px`);
    }
  };

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const ctx = canvas.getContext("2d");
  //     if (ctx) {
  //       const canvasData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  //       const height = CanvasSize.height;
  //       const width = CanvasSize.width;
  //       if (width && height) {
  //         Tool.ctx = ctx as CanvasRenderingContext2D;
  //         canvasPain(Tool.ctx, width, height, canvasData);
  //       }
  //     }
  //   }
  // }, [CanvasSize]);

  // 注册画布size事件
  const canvasPain = async (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    canvasData: ImageData
  ) => {
    console.log("===56", width, height);
    if (ctx) {
      const canvas = canvasRef.current;
      if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = height;
        canvas.width = width;
        if (canvasData) {
          ctx.drawImage(
            await createImageBitmap(canvasData),
            0,
            0,
            width,
            height
          );
        } else {
          ctx.fillStyle = background || "white";
          ctx.fillRect(0, 0, width, height);
        }
      }
      snapshot.add(ctx.getImageData(0, 0, width, height));
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseDown(event);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseMove(event);
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseUp(event);
      // 存储canvas剪影
      snapshot.add(
        Tool.ctx.getImageData(
          0,
          0,
          Tool.ctx.canvas.width,
          Tool.ctx.canvas.height
        )
      );
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchStart(event);
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchMove(event);
    }
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchEnd(event);
    }

    // 存储canvas剪影
    snapshot.add(
      Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height)
    );
  };

  const onMousewheel = async (event: any) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasData = Tool.ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      const { wheelDelta } = event;
      console.log("==4", show_scale);
      if (wheelDelta < 0) {
        //缩小
        if (show_scale > 0.6) {
          Tool.ctx.clearRect(0, 0, canvas.width, canvas.height);
          show_scale = show_scale - 0.01;
          Tool.ctx.scale(show_scale, show_scale);
          Tool.currentScale = show_scale;
        }
        if (canvasData) {
          Tool.ctx.drawImage(
            await createImageBitmap(canvasData),
            0,
            0,
            canvas.width,
            canvas.height
          );
        }
      }
    }

    //const showScale =
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("wheel", onMousewheel);

      canvas.addEventListener("touchstart", onTouchStart);
      canvas.addEventListener("touchmove", onTouchMove);
      canvas.addEventListener("touchend", onTouchEnd);

      return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("wheel", onMousewheel);

        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", onTouchEnd);
      };
    }
  }, [canvasRef, onMouseDown, onMouseMove, onMouseUp]);

  const style = {
    margin: "auto",
  };
  if (allCanvasRef && CanvasSize) {
    const allCanvas = allCanvasRef.current;
    if (allCanvas) {
      style.margin =
        allCanvas.offsetWidth < (CanvasSize?.width || 0) ? "unset" : "auto";
    }
  }
  return (
    <div className="all-canvas" ref={allCanvasRef}>
      <canvas
        id={`ccc-paint-canvas ${id}`}
        className="ccc-paint-canvas"
        ref={canvasRef}
        style={{ background: background || "#fff", ...style }}
      ></canvas>
      <div
        className="canvas-text"
        id="canvas-text"
        ref={canvasTextRef}
        style={{ width: CanvasSize.width, height: CanvasSize.height, ...style }}
      >
        <TextArea
          id="textBox"
          name="story"
          autoFocus={true}
          className="text-box"
          rows={1}
        />
      </div>
    </div>
  );
};

export default Canvas;
