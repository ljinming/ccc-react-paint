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
import cursorPen from "@/assets/icon/cursorPen.jpg";
import cursorErase from "@/assets/icon/cursorErase.jpg";
import straw from "@/assets/icon/straw.jpg";

const { TextArea } = Input;

interface CanvasProps {
  toolType: ToolType;
  shapeType: ShapeToolType;
  shapeOutlineType: ShapeOutlineType;
  lineWidthType: LineWidthType;
  strawType: boolean;
  mainColor: string;
  subColor: string;
  lineSize?: number;
  fillColor: string;
  fontStyle: any;
  imgSrc?: string;
  CanvasSize?: {
    width: number;
    height: number;
  };
  id: string;
  background?: string;
  onSize?: (value: any) => void;
  setColor: (value: string) => void;
}

let show_scale = 1;

const defaultTransition = {
  x: 0,
  y: 0,
};
// 记录 Translate 的坐标值
let prevTranslateMap = {
  x: 0,
  y: 0,
};

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
    strawType,
    lineSize = 1,
  } = props;
  const [tool, setTool] = useState<Tool>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const allCanvasRef = useRef<HTMLDivElement>(null);
  const canvasTextRef = useRef<HTMLDivElement>(null);
  const dispatcherContext = useContext(DispatcherContext);
  const [snapshot] = useState<SnapShot>(new SnapShot());

  useEffect(() => {
    showCanvasCursor();
    switch (toolType) {
      case ToolType.PEN:
        setTool(new Pen());
        break;
      case ToolType.ERASER:
        setTool(new Eraser(lineSize));
        break;
      // case ToolType.COLOR_EXTRACT:
      //   setTool(new ColorExtract(setColor));
      //   break;
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
  }, [toolType, shapeType, fontStyle, lineSize]);

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
    if (canvas) {
      showCanvasCursor();
      drawCanvas();
      Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
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
              snapshot.add(imgData);
            };
          } else {
            ctx.fillStyle = "#2d2d2d";
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

      return () => {
        dispatcher.off(CLEAR_EVENT, callback);
      };
    }
  }, [canvasRef]);

  useEffect(() => {
    showCanvasCursor();
  }, [strawType]);

  //鼠标icon
  const showCanvasCursor = () => {
    console.log("===45", strawType);
    const canvas = canvasRef.current;
    if (canvas) {
      if (strawType) {
        //吸色
        return (canvas.style.cursor = `url(${straw}),auto`);
      }
      if (toolType === 0) {
        canvas.style.cursor = `url(${cursorPen}) 12 16,auto`;
      } else if (toolType === 4) {
        canvas.style.cursor = `url(${cursorErase}),auto`;
      } else {
        canvas.style.cursor = `auto`;
      }
    }
  };

  const defaultCanvas = (
    showScale: number,
    OffsetX: number,
    OffsetY: number
  ) => {
    const container = allCanvasRef!.current;
    const canvas = canvasRef.current;
    const textRef = canvasTextRef.current;
    if (container && canvas && textRef) {
      canvas.setAttribute(
        "style",
        `transform:scale(${showScale},${showScale}) translate(${OffsetX}px, ${OffsetY}px);cursor:url(${cursorPen})12 16,auto`
      );
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const container = allCanvasRef!.current;
    const textRef = canvasTextRef.current;
    if (canvas && container && textRef) {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (imgSrc) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imgSrc;
        img.onload = function () {
          canvas.height = img.height;
          canvas.width = img.width;
          /*1.在canvas 中绘制图像*/
          // ctx.scale(showScale, showScale);
          textRef.setAttribute(
            "style",
            `width:${canvas.width};height:${canvas.height}`
          );
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
        };
      } else if (CanvasSize) {
        canvas.height = CanvasSize.height;
        canvas.width = CanvasSize.width;
        ctx.fillStyle = background || "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
    }
  };

  useEffect(() => {
    const container = allCanvasRef!.current;
    const canvas = canvasRef.current;

    if (CanvasSize && container && canvas) {
      const containerType = container?.getBoundingClientRect();
      drawCanvas();
      let showScale = 1;
      const height = container!.clientHeight;
      const width = container!.clientWidth;
      showScale =
        Math.min(width, height) / Math.max(CanvasSize.height, CanvasSize.width);
      show_scale = showScale;
      Tool.currentScale = showScale;
      const showWidth = CanvasSize.width * showScale;
      const showHeight = CanvasSize.height * showScale;
      const OffsetX = CanvasSize.width - showWidth;
      const OffsetY = CanvasSize.height - showHeight;
      const x = (containerType.width - showWidth) * 0.5 - OffsetX / 2;
      const y = (containerType.height - showHeight) * 0.5 - OffsetY / 2;
      prevTranslateMap = {
        x,
        y,
      };
      canvas.style.transform = `translate(${x}px, ${y}px) scale(${show_scale})`;
      //  defaultCanvas(showScale, 0, 0);
      //  clacTransition({}, show_scale);
    }
  }, [CanvasSize]);

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

  const clacTransition = (event: any, show_scale: number) => {
    const canvas = canvasRef.current;
    if (canvas && CanvasSize) {
      const {
        top: pTop,
        left: pLeft,
        height,
        width,
      } = canvas.getBoundingClientRect();
      const { clientX: mouseX = 0, clientY: mouseY = 0 } = event;
      console.log("===456", event);
      // 获取比例
      const yScale = (mouseY - pTop - prevTranslateMap.y) / height;
      const xScale = (mouseX - pLeft - prevTranslateMap.x) / width;
      // 放大后的宽高
      const ampWidth = CanvasSize?.width * show_scale;
      const ampHeight = CanvasSize?.height * show_scale;
      // 需要重新运算的 translate 坐标
      const y = yScale * (ampHeight - height);
      const x = xScale * (ampWidth - width);
      // 更新
      const translateY = prevTranslateMap.y - y;
      const translateX = prevTranslateMap.x - x;

      defaultCanvas(show_scale, translateX, translateY);
      // 记录这次的值
      prevTranslateMap = {
        x: translateX,
        y: translateY,
      };
    }
  };

  const onMousewheel = (event: any) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (canvas && CanvasSize) {
      const { wheelDelta, offsetX, offsetY } = event;
      let OffsetX = 0;
      let OffsetY = 0;
      if (wheelDelta > 0) {
        if (show_scale < 8) {
          console.log("===56", show_scale);
          show_scale += 0.1;
          OffsetX = offsetX * 0.1 - offsetX;
          OffsetY = offsetY * 0.1 - offsetX;
          if (defaultTransition.x === 0) {
            OffsetX = CanvasSize.width * 0.1;
          }
          clacTransition(event, show_scale);

          // defaultCanvas(show_scale, 0, 0);
        }
      } else {
        if (show_scale > 0.5) {
          show_scale = show_scale - 0.1;
          // OffsetX = x - x * show_scale; // x * 绝对缩放率 得到位移
          // OffsetY = y - y * show_scale; // y * 绝对缩放率 得到位移
          //defaultCanvas(show_scale, OffsetX, OffsetY);
        }
      }
      Tool.currentScale = show_scale;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("wheel", onMousewheel, { passive: false });

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
        style={{
          background: background || "#fff",
          ...style,
        }}
      ></canvas>
      <div className="canvas-text" id="text-container" ref={canvasTextRef}>
        <TextArea
          id="textBox"
          name="story"
          autoFocus={true}
          bordered={true}
          autoSize={{ minRows: 2, maxRows: 2 }}
          className="text-box"
          // rows={1}
        />
      </div>
    </div>
  );
};

export default Canvas;
function trr(arg0: Float32Array, trr: any, o: any) {
  throw new Error("Function not implemented.");
}
