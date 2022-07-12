import { fabric } from "fabric";
import { Tool, Pen, Shape, Eraser, Bucket, CanvasText } from "@/tool";
import { useEffect, useRef, useState } from "react";
import cursorPen from "@/assets/icon/cursorPen.jpg";
import cursorErase from "@/assets/icon/cursorErase.jpg";
import straw_jpg from "@/assets/icon/straw.jpg";
import bucket from "@/assets/icon/bucket.jpg";
import { efficentFloodFill, getTrans } from "./utils";
import "./index.less";

let translatex = 0;
let translatey = 0;
let show_scale = 1;
const scaleStep = 0.01;
const maxScale = 6;
const minScale = 0.1;

/*设置为2d模块 如不设置 默认webgl 为true*/
// const canvas2dBackend = new fabric.Canvas2dFilterBackend();
// fabric.filterBackend = canvas2dBackend;

/*filter*/
// fabric.Image.filters["ChangeColorFilter"] = fabric.util.createClass(
//   fabric.Image.filters.BaseFilter,
//   {
//     type: "ChangeColorFilter",
//     applyTo: function (options: any) {
//       let imageData = options.imageData;
//       // const context = options.canvasEl.getContext("2d");
//       // const newimageData = context.getImageData(
//       //   0,
//       //   0,
//       //   options.canvasEl.width,
//       //   options.canvasEl.height
//       // );
//       // const ctx = options.ctx;
//       if (this.fillColor && this.pos) {
//         imageData = efficentFloodFill(
//           imageData,
//           this.pos.x,
//           this.pos.y,
//           this.fillColor
//         );
//       }
//       options.ctx.putImageData(this.ctx || imageData, 0, 0);
//     },
//   }
// );

// fabric.Image.filters["ChangeColorFilter"].fromObject = function (object: any) {
//   return new fabric.Image.filters["ChangeColorFilter"](object);
// };

interface CanvasProps {
  backgroundColor?: string;
  canvasSize: {
    width: number;
    height: number;
  };
  imgSrc?: string;
  tool: string;
  id?: string;
  straw: {
    strawFlag: boolean;
    strawColor: string;
  };
}
export default (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const [manager, setManage] = useState<Tool>();
  const [fabricCanvas, setCanvas] = useState<fabric.Canvas>();
  const { canvasSize, imgSrc, backgroundColor, tool, id, straw } = props;
  useEffect(() => {
    const canvasBox = canvasBoxRef.current;
    const canvasCurrent = canvasRef.current;
    if (canvasBox && canvasCurrent) {
      const { width, height } = canvasBox!.getBoundingClientRect();
      if (canvasSize && canvasCurrent) {
        const showScale =
          Math.min(width, height) /
            Math.max(canvasSize.height, canvasSize.width) || 1;
        translatex = (width - canvasSize.width * showScale) / 2;
        translatey = (height - canvasSize.height * showScale) / 2;
        canvasCurrent.style.transform = `scale(${showScale}) translate(${translatex}px,${translatey}px)`;
        show_scale = showScale;
        //初始化画布
        const canvas = new fabric.Canvas(canvasCurrent, {
          width: canvasSize.width, // 画布宽度
          height: canvasSize.height, // 画布高度
          backgroundColor: backgroundColor || "#2d2d2d", // 画布背景色
        });

        Tool.canvas = canvas;
        Tool.transform = `scale(${showScale}) translate(${translatex}px,${translatey}px)`;
        Tool.currentScale = showScale;
        canvas.freeDrawingCursor = `url(${cursorPen}) 12 16,auto`;
        setManage(new Pen());
        if (imgSrc) {
          Tool.imgSrc = imgSrc;
          fabric.Image.fromURL(
            imgSrc,
            (img) => {
              img.selectable = false;
              img.evented = false;
              //img.width = canvasSize.width;
              // img.filters?.push(
              //   new fabric.Image.filters["ChangeColorFilter"]()
              // );
              // img.applyFilters();
              Tool.img = img;
              canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            },
            { crossOrigin: "anonymous" }
          );
        }
        setCanvas(canvas);
      }
    }
  }, [canvasSize]);

  useEffect(() => {
    Tool.toolType = tool;
    if (fabricCanvas) {
      switch (tool) {
        case "PEN":
          // 开启绘画功能
          setManage(new Pen());
          break;
        case "SHAPE":
          //关闭绘画功能
          setManage(new Shape());
          break;
        case "ERASER":
          setManage(new Eraser());
          break;
        case "BUCKET":
          setManage(new Bucket());
          break;
        case "TEXT":
          Tool.canvas.isDrawingMode = false;
          setManage(new CanvasText());
          break;
      }
    }
  }, [tool]);

  useEffect(() => {
    if (fabricCanvas) {
      if (straw.strawFlag) {
        fabricCanvas.freeDrawingCursor = `url(${straw_jpg}) 6 20,auto`;
      } else {
        switch (tool) {
          case "PEN":
            // 开启绘画功能
            fabricCanvas.freeDrawingCursor = `url(${cursorPen}) 12 16,auto`;
            break;
          case "ERASER":
            fabricCanvas.freeDrawingCursor = `url(${cursorErase}) 12 16,auto`;
            break;
          case "BUCKET":
            fabricCanvas.defaultCursor = `url(${bucket}) 12 16,auto`;
            break;
          default:
            fabricCanvas.defaultCursor = "default";
        }
      }
    }
  }, [tool, straw.strawFlag]);

  const clacCanvasTransform = (
    scale: number,
    translatex: number,
    translatey: number
  ) => {
    const upEleCanvasList =
      document.getElementsByClassName("upper-canvas") || [];
    let upEleCanvas;

    for (let i = 0; i < upEleCanvasList.length; i++) {
      if (upEleCanvasList[i]?.clientWidth === canvasSize.width) {
        upEleCanvas = upEleCanvasList[i];
        break;
      }
    }
    //
    const new_translatex = Number((translatex / scale).toFixed(3));
    const new_translatey = Number((translatey / scale).toFixed(3));

    if (upEleCanvas) {
      upEleCanvas[
        "style"
      ].transform = `scale(${scale}) translate(${new_translatex}px,${new_translatey}px)`;
    }
  };

  const onMouseDown = (options: any) => {
    if (manager) {
      manager.onMouseDown(options);
    }
  };
  const onMouseMove = (options: any) => {
    if (manager && tool === "SHAPE") {
      manager.onMouseMove(options);
    }
  };

  const onMouseUp = (options: any) => {
    if (manager) {
      const ctx = Tool.canvas.getContext();
      const imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      if (Tool.ToolStoreList.length < 10) {
        Tool.ToolStoreList.push(imageData);
      } else {
        Tool.ToolStoreList.shift();
        Tool.ToolStoreList.push(imageData);
      }
      manager.onMouseUp(options);
    }
  };

  const onSelected = (options: any) => {
    Tool.currentSelected = options.selected;
    if (manager && tool === "SHAPE") {
      manager.onSelected(options);
    }
  };

  const onCancelSelected = (options: any) => {
    if (manager) {
      manager.onCancelSelected(options);
    }
  };

  const onDbClick = (options: any) => {
    if (manager) {
      manager.onDbClick(options);
    }
  };

  const onWheel = (options: any) => {
    const { e: event } = options;
    event.preventDefault();
    const canvas = canvasRef.current;
    const container = canvasBoxRef!.current;
    const { clientX, clientY, deltaX, deltaY, ctrlKey } = event;
    const { width, height, x, y } = container!.getBoundingClientRect();
    let newScale;
    if (canvas) {
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
          canvasSize,
          {
            width,
            height,
            x,
            y,
          },
          show_scale,
          translatex,
          translatey
        );
        const transY = getTrans(
          clientY,
          newScale,
          "height",
          canvasSize,
          {
            width,
            height,
            x,
            y,
          },
          show_scale,
          translatex,
          translatey
        );
        translatex = translatex - transX;
        translatey = translatey - transY;
        show_scale = newScale;
        canvas.style.transform = `translate(${translatex}px, ${translatey}px) scale(${show_scale})`;
        clacCanvasTransform(newScale, translatex, translatey);
      }
    }
  };

  const onCanvasBoxWheel = (event: WheelEvent) => {
    event.preventDefault();
    const { deltaX, deltaY, ctrlKey } = event;
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
      canvas!.style.transform = `translate(${translatex}px, ${translatey}px) scale(${show_scale})`;
      clacCanvasTransform(show_scale, translatex, translatey);
    }
  };

  const onkeydown = (e: KeyboardEvent) => {
    const { keyCode } = e;
    if (keyCode === 8 && Tool.currentSelected.length > 0) {
      //删除选中的图层
      Tool.canvas.remove(...Tool.currentSelected);
    }
  };

  useEffect(() => {
    const canvasBox = canvasBoxRef.current;
    const canvas = canvasRef.current;
    if (fabricCanvas && canvasBox && canvas) {
      //键盘事件
      window.addEventListener("keydown", onkeydown);

      fabricCanvas.on("mouse:down", onMouseDown);
      fabricCanvas.on("mouse:move", onMouseMove);
      fabricCanvas.on("mouse:up", onMouseUp);
      //双击
      fabricCanvas.on("mouse:dblclick", onDbClick);

      //缩放
      fabricCanvas.on("mouse:wheel", onWheel);
      canvasBox.addEventListener("wheel", onCanvasBoxWheel, {
        passive: false,
      });

      // 监听绘画选中/取消⌚️
      fabricCanvas.on("selection:created", onSelected);
      fabricCanvas.on("selection:cleared", onCancelSelected);

      // fabricCanvas.on("after:render", () => {
      //   Tool.afterRender();
      // });
    }
    return () => {
      window.removeEventListener("keydown", onkeydown);
    };
  }, [
    fabricCanvas,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDbClick,
    onSelected,
    onCancelSelected,
  ]);

  return (
    <div className="ccc-canvas-box" ref={canvasBoxRef}>
      <canvas
        ref={canvasRef}
        className="ccc-paint-canvas"
        id={`ccc-paint-canvas ${id}`}
      ></canvas>
    </div>
  );
};
