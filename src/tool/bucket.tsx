import Tool, { addContext, clacArea, Point, setStrawColor } from "./tool";
import { parseColorString } from "./colorChange";
import { fabric } from "fabric";

/**
 * 高效率的填充算法
 * 参考地址: http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
 */
export const efficentFloodFill = (
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: [number, number, number]
) => {
  // 保证 startX 和 startY 是正整数
  // 经测试，在触屏设备中 startX 和 startY 可能是小数，造成填充功能无法正确填充
  startX = Math.round(startX);
  startY = Math.round(startY);
  const pixelStack: [number, number][] = [
    [Math.round(startX), Math.round(startY)],
  ];

  const canvasWidth = imageData.width,
    canvasHeight = imageData.height;
  const startPos = (startY * canvasWidth + startX) * 4;
  const colorLayer = imageData;
  const startColor: [number, number, number] = [
    colorLayer.data[startPos],
    colorLayer.data[startPos + 1],
    colorLayer.data[startPos + 2],
  ];
  const updatedPoint: Record<string | number, boolean> = {};
  if (
    startColor[0] === fillColor[0] &&
    startColor[1] === fillColor[1] &&
    startColor[2] === fillColor[2]
  ) {
    return undefined;
  }
  while (pixelStack.length > 0) {
    const newPos = pixelStack.pop() as [number, number];
    const x = newPos[0];
    let y = newPos[1];
    let pixelPos = (y * canvasWidth + x) * 4;
    while (y-- >= 0 && matchColor(colorLayer, pixelPos, startColor)) {
      pixelPos -= canvasWidth * 4;
    }
    pixelPos += canvasWidth * 4;
    ++y;
    let reachLeft = false,
      reachRight = false;

    if (updatedPoint[pixelPos]) {
      continue;
    }
    updatedPoint[pixelPos] = true;
    // newData.push(pixelPos);
    while (
      y++ < canvasHeight - 1 &&
      matchColor(colorLayer, pixelPos, startColor)
    ) {
      fillPixel(colorLayer, pixelPos, fillColor);
      if (x > 0) {
        if (matchColor(colorLayer, pixelPos - 4, startColor)) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < canvasWidth - 1) {
        if (matchColor(colorLayer, pixelPos + 4, startColor)) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);

            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      pixelPos += canvasWidth * 4;
    }
  }

  return colorLayer;
};

/**
 * 判断两个位置的像素颜色是否相同
 */

/*
  多边形计算
*/
export const efficentFloodFillPonits = (
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: [number, number, number]
) => {
  // 保证 startX 和 startY 是正整数
  // 经测试，在触屏设备中 startX 和 startY 可能是小数，造成填充功能无法正确填充
  startX = Math.round(startX);
  startY = Math.round(startY);
  const pixelStack: [number, number][] = [
    [Math.round(startX), Math.round(startY)],
  ];
  const testStack: {
    x: number;
    y: number;
  }[] = [
    {
      x: Math.round(startX) / 2,
      y: Math.round(startY) / 2,
    },
  ];
  const canvasWidth = imageData.width,
    canvasHeight = imageData.height;
  const startPos = (startY * canvasWidth + startX) * 4;
  const colorLayer = imageData;
  const startColor: [number, number, number] = [
    colorLayer.data[startPos],
    colorLayer.data[startPos + 1],
    colorLayer.data[startPos + 2],
  ];
  const updatedPoint: Record<string | number, boolean> = {};
  if (
    startColor[0] === fillColor[0] &&
    startColor[1] === fillColor[1] &&
    startColor[2] === fillColor[2]
  ) {
    return undefined;
  }
  while (pixelStack.length > 0) {
    const newPos = pixelStack.pop() as [number, number];
    const x = newPos[0];
    let y = newPos[1];
    let pixelPos = (y * canvasWidth + x) * 4;
    while (y-- >= 0 && matchColor(colorLayer, pixelPos, startColor)) {
      pixelPos -= canvasWidth * 4;
    }
    pixelPos += canvasWidth * 4;
    ++y;
    let reachLeft = false,
      reachRight = false;

    if (updatedPoint[pixelPos]) {
      continue;
    }
    testStack.push({ x: x / 2, y: y / 2 });
    updatedPoint[pixelPos] = true;
    // newData.push(pixelPos);
    while (
      y++ < canvasHeight - 1 &&
      matchColor(colorLayer, pixelPos, startColor)
    ) {
      fillPixel(colorLayer, pixelPos, fillColor);
      if (x > 0) {
        if (matchColor(colorLayer, pixelPos - 4, startColor)) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < canvasWidth - 1) {
        if (matchColor(colorLayer, pixelPos + 4, startColor)) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      pixelPos += canvasWidth * 4;
    }
  }
  return testStack;
  //return colorLayer;
};

const matchColor = (
  colorLayer: ImageData,
  pixelPos: number,
  color: [number, number, number]
) => {
  const r = colorLayer.data[pixelPos];
  const g = colorLayer.data[pixelPos + 1];
  const b = colorLayer.data[pixelPos + 2];

  return (
    Math.abs(r - color[0]) < 30 &&
    Math.abs(g - color[1]) < 30 &&
    Math.abs(b - color[2]) < 30
  );
};

/**
 * 修改指定ImageData的指定位置像素颜色
 */
const fillPixel = (
  colorLayer: ImageData,
  pixelPos: number,
  color: [number, number, number]
) => {
  colorLayer.data[pixelPos] = color[0];
  colorLayer.data[pixelPos + 1] = color[1];
  colorLayer.data[pixelPos + 2] = color[2];

  return colorLayer;
};

class Bucket extends Tool {
  static color: string = "transparent";
  static selected: boolean;
  static selectedList: any;
  constructor() {
    super();
    this.init();
  }

  static changeColor = (color: string) => {
    this.color = color;
    Tool.currentSelected?.forEach((va: any) => {
      if (va.fill) {
        va.set("fill", color);
      }
      va.set("stroke", color);
    });
    Tool.canvas.renderAll();
  };

  init() {
    Tool.canvas.isDrawingMode = false;
  }

  filterChange = async (pos: Point) => {
    const color = parseColorString(Tool.strawColor || Bucket.color);
    const showCtx = Tool.canvas.getContext();
    const showImageData = showCtx.getImageData(
      0,
      0,
      showCtx.canvas.width,
      showCtx.canvas.height
    );
    // const taskList = efficentFloodFillPonits(
    //   showImageData,
    //   pos.x * 2,
    //   pos.y * 2,
    //   [color.r, color.g, color.b]
    // );
    // if (taskList) {
    //   const pask = new fabric.Polygon([...taskList], {
    //     fill: "red",
    //     //objectCaching: false,
    //   });
    //   Tool.canvas.add(pask);
    //   Tool.canvas.renderAll();
    // }

    const colorLayer = efficentFloodFill(showImageData, pos.x * 2, pos.y * 2, [
      color.r,
      color.g,
      color.b,
    ]);

    if (colorLayer) {
      showCtx.putImageData(colorLayer, 0, 0);
      let canvasBucket: HTMLCanvasElement | undefined =
        document.createElement("canvas");
      canvasBucket.width = colorLayer.width;
      canvasBucket.height = colorLayer.height;
      canvasBucket?.getContext("2d")?.putImageData(colorLayer, 0, 0);
      const url = canvasBucket.toDataURL();
      Tool.canvas.setBackgroundImage(
        url,
        (img: any) => {
          img.selectable = false;
          img.evented = false;
          Tool.canvas.renderAll();
        },
        { crossOrigin: "anonymous", scaleX: 0.5, scaleY: 0.5 }
      );
      canvasBucket = undefined;
      addContext();
    }

    // const filter = new fabric.Image.filters["ChangeColorFilter"]({
    //   pos,
    //   fillColor: [color.r, color.g, color.b],
    // });
    // if (Tool.img) {
    //   Tool.img.filters?.push(filter);
    // }
    // //Tool.img.filters.push(new fabric.Image.filters.Grayscale());
    // Tool.img.applyFilters();
    // Tool.canvas.renderAll();
  };

  public onMouseDown(options: any): void {
    if (Tool.toolType !== "BUCKET") {
      return;
    }
    const { e, pointer, absolutePointer } = options;

    e.preventDefault();
    if (!clacArea(absolutePointer)) {
      return;
    }
    if (Tool.strawFlag) {
      const show = {
        x: absolutePointer.x * 2,
        y: absolutePointer.y * 2,
      };
      setStrawColor(show);
      return;
    }
    this.filterChange(absolutePointer);
  }

  public onSelected(options: any): void {
    if (Tool.toolType !== "BUCKET") {
      return;
    }
    Bucket.selected = true;
    Bucket.selectedList = options.selected;
  }

  public onCancelSelected(options: any): void {
    if (Tool.toolType !== "BUCKET") {
      return;
    }
    Bucket.selected = false;
    Bucket.selectedList = [];
  }
}

export default Bucket;
