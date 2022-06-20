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
import * as glMatrix from "gl-matrix";
//import { glMatrix as glMatrix } from "gl-matrix";

const { TextArea } = Input;

interface IPos {
  x: number;
  y: number;
}

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
    width: number;
    height: number;
  };
  id: string;
  background?: string;
  onSize?: (value: any) => void;
  setColor: (value: string) => void;
}

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
  const dispatcherContext = useContext(DispatcherContext);
  const [snapshot] = useState<SnapShot>(new SnapShot());
  const [scale, setScale] = useState<number>(1);

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
    console.log("=====5", lineSize);
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
    //第一次进入页面,渲染首次页面
    const canvas = canvasRef.current;
    const box = allCanvasRef.current;
    console.log("------4", canvas);
    if (canvas && box) {
      const boxWidth = box.clientWidth;
      const boxHeight = box.clientHeight;
      const width = CanvasSize.width;
      const height = CanvasSize.height;
      canvas.height = height;
      canvas.width = width;
      Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (imgSrc) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imgSrc;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          img.onload = function () {
            /*1.在canvas 中绘制图像*/
            const scale = (Math.min(boxWidth, boxHeight) - 100) / img.width;
            setScale(scale);
            canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
          };
        } else {
          ctx.fillStyle = background || "white";
          ctx.fillRect(0, 0, width, height);
        }
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
  }, [CanvasSize]);

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

  const onMousewheel = (event: WheelEvent) => {
    const { deltaX, deltaY } = event;
  };

  const onDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    //先清除画布，清除两倍的画布，因为要改变坐标原点，只有这样才能不管原点在哪里都能完全清除画布
    ctx.clearRect(
      canvas.width,
      canvas.height,
      canvas.width * 2,
      canvas.height * 2
    );
    // //画图片，因为原点在图片的中心点，所以每次画图只需要从图片的负一半坐标开始画，就能看到我们想要的效果
    // ctx.drawImage(imgData, imgData.wi / 2, -imgH / 2, imgW, imgH); //这里再加上两个参数，这两个参数是告诉canvas需要画多宽多高
    // //可旋转图标
    // ctx.drawImage(imgIcon, imgW / 2, -imgH / 2 - iconR);
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

  return (
    <div className="all-canvas" ref={allCanvasRef}>
      <canvas
        id={`ccc-paint-canvas ${id}`}
        className="ccc-paint-canvas"
        ref={canvasRef}
        style={{ background: background || "#fff" }}
      ></canvas>
      <div
        className="canvas-text"
        id="canvas-text"
        style={{ width: CanvasSize.width, height: CanvasSize.height }}
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
