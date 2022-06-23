import React, { useMemo } from "react";
import "./index.less";
import { useEffect } from "react";
import { useRef } from "react";
import { LineWidthType, ShapeOutlineType, ShapeToolType, ToolType } from "../util/toolType";
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
import * as glMatrix from "gl-matrix";
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
const center = {
  x: 0,
  y: 0
};

const defaultTransition = {
  x: 0,
  y: 0
};
// 记录 Translate 的坐标值
// let prevTranslateMap = {
//   x: 0,
//   y: 0
// };

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
    lineSize = 1
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
        setTool(new Shape(shapeType, shapeOutlineType === ShapeOutlineType.DOTTED));
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

  const defaultCanvas = (showScale: number, OffsetX: number, OffsetY: number) => {
    const container = allCanvasRef!.current;
    const canvas = canvasRef.current;
    const textRef = canvasTextRef.current;
    console.log("----34", OffsetX, OffsetY);
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
          textRef.setAttribute("style", `width:${canvas.width};height:${canvas.height}`);
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
      drawCanvas();
      let showScale = 1;
      const height = container!.clientHeight;
      const width = container!.clientWidth;
      showScale = Math.min(width, height) / Math.max(CanvasSize.height, CanvasSize.width);
      show_scale = showScale;
      Tool.currentScale = showScale;
      center.x = (width - canvas.width * showScale) / 2;
      center.y = (height - canvas.height * showScale) / 2;
      console.log("===567", center.x);
      defaultCanvas(showScale, center.x, center.y);
    }
  }, [CanvasSize]);

  const onMouseDown = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    console.log("==", offsetX, offsetY);
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
      snapshot.add(Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height));
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
    snapshot.add(Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height));
  };

  const onMousewheel = (event: any) => {
    // event.preventDefault();
    const canvas = canvasRef.current;
    const container = allCanvasRef!.current;
    const { wheelDelta, clientX, clientY, deltaY, offsetX, offsetY } = event;
    const { width, height } = canvas!.getBoundingClientRect();
    // const { width: boxWidth, height: boxHeight } = container!.getBoundingClientRect();
    // let ratio = 1.1;
    // // 缩小
    // if (deltaY > 0) {
    //   ratio = 1 / 1.1;
    // }
    // // 限制缩放倍数
    // const _scale = show_scale * ratio;
    // if (_scale > 5) {
    //   ratio = 5 / show_scale;
    //   show_scale = 5;
    // } else if (_scale < 0.5) {
    //   ratio = 0.5 / show_scale;
    //   show_scale = 0.5;
    // } else {
    //   show_scale = _scale;
    // }
    // // 目标元素是img说明鼠标在img上，以鼠标位置为缩放中心，否则默认以图片中心点为缩放中心
    // const origin = {
    //   x: (ratio - 1) * CanvasSize!.width * 0.5,
    //   y: (ratio - 1) * CanvasSize!.height * 0.5
    // };
    // 计算偏移量
    // center.x -= (ratio - 1) * (clientX - center.x) - origin.x;
    // center.y -= (ratio - 1) * (clientY - center.y) - origin.y;
    // canvas!.style.transform = "translate3d(" + center.x + "px, " + center.y + "px, 0) scale(" + show_scale + ")";

    if (canvas && CanvasSize && container) {
      let OffsetX = 0;
      let OffsetY = 0;
      // 当前鼠标点  clientX，clientX
      //当前缩放倍数 show_scale
      // 原始像素点 offsetX/show_scale,offsetY/show_scale

      // 此时放大的像素位置 offsetX/show_scale*（currentSacle）,offsetY/show_scale*（currentSacle）

      // 像素点偏移了 // 放大后素位置 - 此时的像素位置 offsetX/show_scale*（currentSacle） - offsetX
      console.log("===4", canvas.getBoundingClientRect());

      if (wheelDelta > 0) {
        const { width, height } = canvas!.getBoundingClientRect();
        const leftX =
          container!.getBoundingClientRect().width > width ? (container!.getBoundingClientRect().width - width) / 2 : 0;
        const leftY =
          container!.getBoundingClientRect().height > height
            ? (container!.getBoundingClientRect().height - height) / 2
            : 0;

        if (show_scale < 0.9) {
          show_scale += 0.01;
          console.log("==46", show_scale);
          canvas!.setAttribute("style", `transform-origin:${offsetX}px ${offsetY}px`);
          // 当前放大的倍数 offsetX * 0.01;
          // OffsetX = (offsetX / Tool.currentScale) * show_scale - offsetX + leftX;
          // OffsetY = (offsetY / Tool.currentScale) * show_scale - offsetY + leftY;
          //defaultCanvas(show_scale, 0, 0);
          //calcTransform(show_scale);
        }
      } else {
        if (show_scale > 0.5) {
          show_scale = show_scale - 0.1;
          OffsetX = offsetX * show_scale; // x * 绝对缩放率 得到位移
          OffsetY = offsetY * show_scale; // y * 绝对缩放率 得到位移
          defaultCanvas(show_scale, OffsetX, OffsetY);
        }
      }
      Tool.currentScale = show_scale;
    }
  };

  // document.addEventListener("DOMContentLoaded", () => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     canvas.addEventListener("wheel", (e: any) => {
  //       const { clientX, clientY, deltaY } = e;
  //       if (deltaY > 0) {
  //         show_scale = show_scale + 0.01;
  //       } else {
  //         show_scale = show_scale + 0.01;
  //       }
  //       const { top, right, bottom, left } = canvas.getBoundingClientRect();
  //       const o = new Float32Array([left, top, 1, 1, right, top, 1, 1, right, bottom, 1, 1, left, bottom, 1, 1]);
  //       const x = clientX * (1 - show_scale);
  //       const y = clientY * (1 - show_scale);
  //       const t = new Float32Array([show_scale, 0, 0, 0, 0, show_scale, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  //       const m = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, 0, 1]);
  //       // 在XY轴上进行缩放
  //       const res1 = glMatrix.mat4.multiply(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), t, o);
  //       // 在XY轴上进行平移
  //       const res2 = glMatrix.mat4.multiply(
  //         new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  //         m,
  //         res1
  //       );
  //       canvas.setAttribute(
  //         "style",
  //         `left: ${res2[0]}px; top: ${res2[1]}px;width: ${res2[4] - res2[0]}px;height: ${
  //           res2[9] - res2[1]
  //         }px;transform: none;`
  //       );
  //     });
  //   }
  // });

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
    margin: "auto"
  };
  if (allCanvasRef && CanvasSize) {
    const allCanvas = allCanvasRef.current;
    if (allCanvas) {
      style.margin = allCanvas.offsetWidth < (CanvasSize?.width || 0) ? "unset" : "auto";
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
          ...style
        }}
      ></canvas>
      <div className="canvas-text" id="text-container" ref={canvasTextRef}>
        <TextArea
          id="textBox"
          name="story"
          autoFocus={true}
          bordered={true}
          autoSize={{ minRows: 2, maxRows: 2 }}
          className={`text-box ${toolType !== 2 ? "text-show" : ""}`}
          // rows={1}
        />
      </div>
    </div>
  );
};

export default Canvas;
