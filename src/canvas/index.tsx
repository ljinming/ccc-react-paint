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
let imgSize = {
  width: 1000,
  height: 1000,
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
    lineSize = 1,
  } = props;
  const [tool, setTool] = useState<Tool>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const allCanvasRef = useRef<HTMLDivElement>(null);
  const canvasTextRef = useRef<HTMLDivElement>(null);
  const dispatcherContext = useContext(DispatcherContext);
  const [snapshot] = useState<SnapShot>(new SnapShot());
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  const defaultCanvas = (showScale: number) => {
    const container = allCanvasRef!.current;
    const canvas = canvasRef.current;
    const textRef = canvasTextRef.current;
    if (container && canvas && textRef) {
      // const width = imgSize.width * showScale;
      // const height = imgSize.height * showScale;
      const styleCanvas = canvas.getBoundingClientRect();
      canvas.setAttribute(
        "style",
        `transform:scale(${showScale},${showScale})`
      );
      //  container.setAttribute("style", `height:${height}px;width:${width}px`);
      // textRef.setAttribute(
      //   "style",
      //   `transform:scale(${showScale},${showScale})`
      // );
      //textBox.setAttribute("width", `${width}px`);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const container = allCanvasRef!.current;
    const textRef = canvasTextRef.current;

    if (canvas && container && textRef) {
      const width = container!.clientWidth;
      let showScale = 1;
      const height = container!.clientHeight;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (imgSrc) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imgSrc;
        img.onload = function () {
          canvas.height = img.height;
          canvas.width = img.width;
          /*1.在canvas 中绘制图像*/
          showScale = Math.min(width, height) / Math.max(img.height, img.width);
          show_scale = showScale;
          Tool.currentScale = showScale;
          imgSize = { width: img.width, height: img.height };
          // ctx.scale(showScale, showScale);
          defaultCanvas(showScale);
          textRef.setAttribute(
            "style",
            `width:${canvas.width};height:${canvas.height}`
          );
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
        };
      } else {
        canvas.height = CanvasSize.height || 500;
        canvas.width = CanvasSize.width || 500;
        ctx.fillStyle = background || "#2d2d2d";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
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

  const onMousewheel = (event: any) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const offset = {
      x: 0,
      y: 0,
    };

    if (canvas) {
      const { wheelDelta } = event;
      if (wheelDelta > 0) {
        show_scale += 0.1;
        defaultCanvas(show_scale);
        // canvas.setAttribute(
        //   "style",
        //   `transform:scale(${show_scale},${show_scale})`
        // );
      } else {
        if (show_scale > 0.5) {
          show_scale = show_scale - 0.1;
          defaultCanvas(show_scale);
          // canvas.setAttribute(
          //   "style",
          //   `transform:scale(${show_scale},${show_scale})`
          // );
        }
      }
      Tool.currentScale = show_scale;
    }
    // if (canvas) {
    //   const canvasData =
    //     snapshot.getCurrent() ||
    //     Tool.ctx.getImageData(
    //       0,
    //       0,
    //       Tool.ctx.canvas.width,
    //       Tool.ctx.canvas.height
    //     );
    //   const { wheelDelta } = event;
    //   const x = event.offsetX; // 鼠标位置换算到相对原点的坐标
    //   const y = event.offsetX;
    //   let OffsetX = 0;
    //   let OffsetY = 0;
    //   if (wheelDelta > 0) {
    //     if (Tool.currentScale < 5) {
    //       Tool.ctx.clearRect(0, 0, canvas.width, canvas.height);
    //       const show_scale = 1 + 0.01;
    //       Tool.ctx.scale(show_scale, show_scale);
    //       OffsetX = -(x * Tool.currentScale * show_scale - x); // x * 绝对缩放率 得到位移
    //       OffsetY = -(y * Tool.currentScale * show_scale - y); // y * 绝对缩放率 得到位移
    //       Tool.currentScale = Tool.currentScale * show_scale;
    //       renderDraw(canvasData, OffsetX, OffsetY, canvas);
    //     }
    //   } else if (wheelDelta < 0) {
    //     //缩小
    //     if (Tool.currentScale > 0.5) {
    //       Tool.ctx.clearRect(0, 0, canvas.width, canvas.height);
    //       const show_scale = 1 - 0.01;
    //       Tool.ctx.scale(show_scale, show_scale);
    //       OffsetX = x - x * Tool.currentScale * show_scale; // x * 绝对缩放率 得到位移
    //       OffsetY = x - y * Tool.currentScale * show_scale;
    //       Tool.currentScale = Tool.currentScale * show_scale;
    //       renderDraw(canvasData, OffsetX, OffsetY, canvas);
    //     }
    //   }
    // }
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
          // transform: `translateX:${offset.x}; translateY:${offset.y},scaleX:${scale};scaleY:${scale} `,
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
