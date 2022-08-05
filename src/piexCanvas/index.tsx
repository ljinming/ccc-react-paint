import React, { useMemo } from "react";
import "./index.less";
import { useEffect } from "react";
import { useRef } from "react";
import { Button, Input } from "antd";

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
import { refresh, updatePixelBoxs } from "../util/tool/pixelUtil";
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
  const [showScale, setScale] = useState(1);
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
      Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      // 注册清空画布事件
      const dispatcher = dispatcherContext.dispatcher;
      const callback = () => {
        const ctx = canvas.getContext("2d");
        snapshot.clear();
        if (ctx) {
          if (imgSrc) {
            if (Tool.isPixel) {
              Tool.ctx.clearRect(0, 0, canvas.width, canvas.height);
              DrawImgPiex(imgSrc);
              return;
            }
          } else {
            ctx.fillStyle = "#2d2d2d";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      };
      dispatcher.on(CLEAR_EVENT, callback);
      // 注册画布前进事件
      const forward = () => {
        const ctx = Tool.ctx;
        if (ctx) {
          const imageData = snapshot.forward();
          if (imageData) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
            updatePixelBoxs(Tool.ctx);
          }
        }
      };
      dispatcher.on(REDO_EVENT, forward);

      // 注册画布后退事件
      const back = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = snapshot.back();
          const imageDataList = snapshot.getImageDatalist("back") || [];
          if (imageData && imageDataList.length > 1) {
            Tool.ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
          } else if (imageDataList.length === 1) {
            if (imgSrc) {
              Tool.ctx.clearRect(0, 0, canvas.width, canvas.height);
              snapshot.clear("forward");
              DrawImgPiex(imgSrc);
            }
          }
          updatePixelBoxs(ctx);
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
        return (canvas.style.cursor = `url(${straw}) 10 14,auto`);
      }
      if (toolType === 0) {
        canvas.style.cursor = `url(${cursorPen}) 8 14,auto`;
      } else if (toolType === 4) {
        canvas.style.cursor = `url(${cursorErase}) 12 15,auto`;
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

  const DrawImgPiex = async (imgSrc: string) => {
    const canvas = canvasRef.current;
    if (canvas && CanvasSize) {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (ctx) {
        if (imgSrc) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imgSrc;
          img.onload = function () {
            let boxArr = [];
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imgData = ctx?.getImageData(0, 0, img.width, img.height);
            const data = imgData.data;
            for (let i = 0; i < imgData.width; i++) {
              for (let j = 0; j < imgData.height; j++) {
                let index = j * imgData.width + i;
                const flag = index * 4;
                let rgb = `rgba(${data[flag]},${data[flag + 1]},${
                  data[flag + 2]
                },${data[flag + 3] / 255})`;
                const options = {
                  x: i * Tool.OptPixel.size,
                  y: j * Tool.OptPixel.size,
                  shape: "rect",
                  isFill: true,
                  size: Tool.OptPixel.size,
                  fillStyle: rgb,
                  strokeStyle: "transparent",
                };

                const pixel = new Pixel(options);
                boxArr.push(pixel);
                pixel.draw(ctx);
              }
            }
            Tool.PixelBoxs = boxArr;
          };
          updatePixelBoxs(ctx);
          snapshot.add(
            Tool.ctx.getImageData(
              0,
              0,
              Tool.ctx.canvas.width,
              Tool.ctx.canvas.height
            )
          );
        }
      }
    }
  };

  useEffect(() => {
    const container = allCanvasRef!.current;
    const canvas = canvasRef.current;
    if (CanvasSize && container && canvas) {
      if (Tool.ctx) {
        Tool.ctx.clearRect(0, 0, canvas.width, canvas?.height);
      }
      const height = container!.clientHeight;
      const width = container!.clientWidth;
      const showScale = Math.ceil(
        Math.min(width - 20, height - 20) /
          Math.max(CanvasSize.height, CanvasSize.width) || 1
      );
      show_scale = showScale;
      Tool.OptPixel.size = showScale;
      canvas.width = CanvasSize.width * showScale;
      canvas.height = CanvasSize.height * showScale;
      translatex = (width - CanvasSize.width * show_scale) / 2;
      translatey = (height - CanvasSize.height * show_scale) / 2;
      canvas.style.transform = `translate(${translatex}px,${translatey}px)`;
      if (imgSrc) {
        DrawImgPiex(imgSrc);
      }
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

  const onMousewheel = (event: WheelEvent) => {
    event.preventDefault();
    const { deltaY, ctrlKey } = event;
    let newScale;
    const canvas = canvasRef.current;
    if (ctrlKey && CanvasSize && canvas) {
      //双指放大缩小
      if (deltaY < 0) {
        newScale = show_scale + scaleStep;
        newScale = Math.min(newScale, maxScale);
      } else {
        newScale = show_scale - scaleStep;
        newScale = Math.max(newScale, minScale);
      }
      show_scale = newScale;
      canvas.width = CanvasSize.width * showScale;
      canvas.height = CanvasSize.height * showScale;
      if (imgSrc) {
        DrawImgPiex(imgSrc);
      }
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
      canvas!.style.transform = `translate(${translatex}px, ${translatey}px)`;
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
      //   canvas.addEventListener("wheel", onMousewheel, {
      //     passive: false,
      //   });
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
        //canvas.removeEventListener("wheel", onMousewheel);

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
  const handleClick = () => {
    const dpr = window.devicePixelRatio;
    const canvas = canvasRef.current;
    if (canvas && CanvasSize && imgSrc) {
      const imgData = Tool.ctx.getImageData(
        0,
        0,
        Tool.ctx.canvas.width,
        Tool.ctx.canvas.height
      );
      const data = imgData.data;
      Tool.ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = CanvasSize.width;
      canvas.height = CanvasSize.height;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      for (let i = 0; i < imgData.width; i += Tool.OptPixel.size) {
        for (let j = 0; j < imgData.height; j += Tool.OptPixel.size) {
          let index = j * imgData.width + i;
          const flag = index * 4;
          let rgb = `rgba(${data[flag]},${data[flag + 1]},${data[flag + 2]},${
            data[flag + 3]
          })`;
          if (ctx) {
            ctx.fillStyle = rgb;
            ctx.fillRect(i / Tool.OptPixel.size, j / Tool.OptPixel.size, 1, 1);
          }
        }
      }
      //DrawImgPiex(imgSrc);
    }
  };
  return (
    <div className="all-canvas" ref={allCanvasRef} id="all-canvas">
      {/* <Button onClick={handleClick}>恢复</Button> */}
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
