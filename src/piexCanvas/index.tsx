import React, { useMemo } from "react";
import "./index.less";
import { useEffect } from "react";
import { useRef } from "react";
import { Input } from "antd";

import {
  LineWidthType,
  ShapeOutlineType,
  ShapeToolType,
  ToolType,
} from "../util/toolType";
import { FC } from "react";
import { useState } from "react";
import { Pen, Tool, Eraser, ColorFill, Text } from "../util/tool";
import Shape from "../util/tool/shape";
import { useContext } from "react";
import { DispatcherContext } from "../context";
import { CLEAR_EVENT, REDO_EVENT, UNDO_EVENT } from "../util/dispatcher/event";
import SnapShot from "../util/snapshot";
import cursorPen from "@/assets/icon/cursorPen.jpg";
import cursorErase from "@/assets/icon/cursorErase.jpg";
import straw from "@/assets/icon/straw.jpg";
import bucket from "@/assets/icon/bucket.jpg";
import Pixel from "./Pixel";
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

let translatex = 0;
let translatey = 0;

const maxScale = 6;
const minScale = 0.1;
const scaleStep = 0.1;

const Opt = {
  stepX: 16,
  stepY: 16,
  EMPTY_COLOR: "#fff",
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
  const textBoxRef = useRef<HTMLTextAreaElement>(null);
  const dispatcherContext = useContext(DispatcherContext);
  const [snapshot] = useState<SnapShot>(new SnapShot());
  const [text, setText] = useState("");
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
      // drawCanvas();
      Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      Tool.isPixel = true;
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
    const textBox: any = textBoxRef.current;
    const showText = textBox?.resizableTextArea?.textArea;
    if (text) {
      setText("");
    }
    if (canvas) {
      if (strawType) {
        //吸色
        return (canvas.style.cursor = `url(${straw}) 12 16,auto`);
      }
      if (toolType === 0) {
        canvas.style.cursor = `url(${cursorPen}) 12 16,auto`;
      } else if (toolType === 4) {
        canvas.style.cursor = `url(${cursorErase}) 12 16,auto`;
      } else if (toolType === 1) {
        canvas.style.cursor = `url(${bucket}) 12 16,auto`;
      } else {
        canvas.style.cursor = `auto`;
      }
      if (toolType !== 2 && textBox && showText) {
        showText!.setAttribute("style", `z-index:-1;display:none`);
      }
    }
  };

  const refresh = (newBox: any[]) => {
    const canvas = canvasRef.current;
    const showBox = newBox || Tool.PixelBoxs;
    if (canvas) {
      Tool.ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < showBox.length; i++) {
        const pixel = showBox[i];
        pixel.draw(Tool.ctx);
      }
    }
  };

  const DrawImgPiex = (imgSrc: string, boxData: any[]) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const ctxWidth = canvas.width;
      const ctxHeight = canvas.height;
      if (ctx) {
        if (imgSrc) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imgSrc;
          img.style.width = "200px";
          img.style.height = "200px";
          img.onload = function () {
            ctx.drawImage(img, 0, 0, ctxWidth, ctxHeight);
            const imgData = ctx.getImageData(0, 0, ctxWidth, ctxHeight).data;
            const array = [];
            for (let x = Opt.stepX + 1; x < ctxWidth; x += Opt.stepX) {
              for (let y = Opt.stepY + 1; y < ctxHeight; y += Opt.stepY) {
                let index = y * ctxWidth + x;
                let i = index * 4;
                let rgb = `rgb(${imgData[i]},${imgData[i + 1]},${
                  imgData[i + 2]
                })`;
                //透明色转默认色
                if (
                  imgData[i] == 0 &&
                  imgData[i + 1] == 0 &&
                  imgData[i + 2] == 0 &&
                  imgData[i + 3] == 0
                ) {
                  array.push(Opt.EMPTY_COLOR);
                } else {
                  array.push(rgb);
                }
              }
            }
            let newBox = [...boxData];
            for (let index = 0; index < array.length; index++) {
              newBox[index].setColor(array[index]);
            }
            Tool.PixelBoxs = newBox;
            refresh(newBox);
          };
        }
      }
    }
  };

  const drawPixelCanvas = () => {
    //初始化
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let boxArr = [];
        for (let i = Opt.stepX + 1; i < canvas.width; i += Opt.stepX) {
          for (let j = Opt.stepY + 1; j < canvas.height; j += Opt.stepY) {
            const options = {
              x: i,
              y: j,
              shape: "rect",
              isFill: true,
              size: 15,
              fillStyle: Opt.EMPTY_COLOR,
              strokeStyle: "red",
            };
            const pixel = new Pixel(options);
            boxArr.push(pixel);
            pixel.draw(ctx);
          }
        }
        Tool.PixelBoxs = boxArr;
        if (imgSrc) {
          DrawImgPiex(imgSrc, boxArr);
        }
      }
    }
  };

  useEffect(() => {
    const container = allCanvasRef!.current;
    const canvas = canvasRef.current;
    if (CanvasSize && container && canvas) {
      canvas.width = CanvasSize.width;
      canvas.height = CanvasSize.height;
      if (Tool.ctx) {
        Tool.ctx.clearRect(0, 0, canvas.width, canvas?.height);
      }
      drawPixelCanvas();

      //   const height = container!.clientHeight;
      //   const width = container!.clientWidth;
      //   const showScale =
      //     Math.min(width, height) /
      //       Math.max(CanvasSize.height, CanvasSize.width) || 1;
      //   show_scale = showScale; //getScale({ width, height }, CanvasSize);
      //   Tool.currentScale = show_scale;
      //   translatex = (width - CanvasSize.width * show_scale) / 2 / show_scale;
      //   translatey = (height - CanvasSize.height * show_scale) / 2;
      //   Tool.translate = {
      //     translatex,
      //     translatey,
      //   };
      //   canvas.style.transform = `scale(${show_scale}) translate(${translatex}px,${translatey}px)`;
    }
  }, [CanvasSize]);

  const onMouseDown = (event: MouseEvent) => {
    // if (text) {
    //   setText("");
    // }
    if (tool) {
      tool.onMouseDown(event);
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    if (text) {
      setText("");
    }
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

  const getTrans = (
    client: number,
    newScale: number,
    direction: string,
    img: any,
    boxdom: any,
    scale: number
  ) => {
    const lastTrans = direction === "width" ? translatex : translatey;
    // console.log("已经偏移的距离:", lastTrans);

    const sizeChanage = img[direction] * newScale - img[direction] * scale;
    // console.log(`img ${direction}放大了:`, sizeChanage);

    // 整体已经移动过了，需要弥补回来
    const pre = client - lastTrans - boxdom[direction === "width" ? "x" : "y"];

    //console.log("缩放中心到边界的距离", pre);

    const percent = pre / (img[direction] * scale);

    //  console.log("当前缩放尺度下，缩放中心到边界比例", percent);

    const trans = percent * sizeChanage;
    // console.log("缩放中心移动的距离:", trans);
    return trans;
  };

  const onMousewheel = (event: WheelEvent) => {
    event.preventDefault();
    if (toolType === ToolType.TEXT) {
      return;
    }
    const canvas = canvasRef.current;
    const container = allCanvasRef!.current;
    const { clientX, clientY, deltaX, deltaY, ctrlKey } = event;
    const { width, height, x, y } = container!.getBoundingClientRect();
    const { width: canvasWidth, height: canvasHeight } =
      container!.getBoundingClientRect();
    let newScale;
    if (ctrlKey) {
      //双指放大缩小
      if (deltaY < 0) {
        newScale = show_scale + scaleStep;
        newScale = Math.min(newScale, maxScale);
      } else {
        newScale = show_scale - scaleStep;
        newScale = Math.max(newScale, minScale);
      }
      const transX = getTrans(
        clientX,
        newScale,
        "width",
        CanvasSize,
        {
          width,
          height,
          x,
          y,
        },
        show_scale
      );
      const transY = getTrans(
        clientY,
        newScale,
        "height",
        CanvasSize,
        {
          width,
          height,
          x,
          y,
        },
        show_scale
      );
      translatex = translatex - transX;
      translatey = translatey - transY;
      show_scale = newScale;
      Tool.currentScale = newScale;
      Tool.translate = {
        translatex,
        translatey,
      };
      canvas!.style.transform = `translate3d(${translatex}px, ${translatey}px, 0px) scale(${show_scale})`;
    }
  };

  const onCanvasBoxWheel = (event: WheelEvent) => {
    const { clientX, clientY, deltaX, deltaY, ctrlKey } = event;
    event.preventDefault();
    if (toolType === ToolType.TEXT) {
      return;
    }
    const canvas = canvasRef.current;
    if (!ctrlKey) {
      if (!!deltaX && !deltaY) {
        // if (translatex > 0 && translatex < width) {
        // 左右移动 向右 -deltaX < 0  向左   >0
        translatex = Number((translatex - deltaX).toFixed(3));
        // }
      } else if (!!deltaY && !deltaX) {
        // if (translatey > 0 && translatex < height) {
        // 左右移动 向右 -deltaX < 0  向左   >0
        translatey = Number((translatey - deltaY).toFixed(3));
        // }
      }
      Tool.translate = {
        translatex,
        translatey,
      };
      canvas!.style.transform = `translate(${translatex}px, ${translatey}px) scale(${show_scale})`;
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (tool) {
      tool.onKeyDown(e);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseMove(event);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    // const textBox = textBoxRef.current;
    const canvasBox = allCanvasRef.current;
    if (canvas && canvasBox) {
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("wheel", onMousewheel, { passive: false });
      canvas.addEventListener("touchstart", onTouchStart);
      canvas.addEventListener("touchmove", onTouchMove);
      canvas.addEventListener("touchend", onTouchEnd);
      window.addEventListener("keydown", onKeyDown);
      // textBox.addEventListener("keydown", onKeyDown);
      canvasBox.addEventListener("wheel", onCanvasBoxWheel, { passive: false });

      return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("wheel", onMousewheel);

        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", onTouchEnd);
        // textBox.removeEventListener("keydown", onKeyDown);

        canvasBox.removeEventListener("wheel", onCanvasBoxWheel);
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
    <div className="all-canvas" ref={allCanvasRef} id="all-canvas">
      <canvas
        id={`ccc-paint-canvas ${id}`}
        className="ccc-paint-canvas pixel-canvas"
        ref={canvasRef}
        style={{
          background: background,
          ...style,
        }}
      ></canvas>
      <div className="canvas-text" id="text-container" ref={canvasTextRef}>
        <TextArea
          id="textBox"
          ref={textBoxRef}
          autoSize={true}
          size={"small"}
          name="story"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`text-box`}
          // rows={1}
        />
      </div>
    </div>
  );
};

export default Canvas;
