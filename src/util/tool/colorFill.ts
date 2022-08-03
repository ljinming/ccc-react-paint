import Tool, { getMousePos, getTouchPos,setStraw, Point } from "./tool";
import Color from "color";
import { parseColorString } from "../colorChange";
import { refresh } from "./pixelUtil";

/**
 * 高效率的填充算法
 * 参考地址: http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
 */
const efficentFloodFill = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: number[]
) => {
  // 保证 startX 和 startY 是正整数
  // 经测试，在触屏设备中 startX 和 startY 可能是小数，造成填充功能无法正确填充
  startX = Math.round(startX);
  startY = Math.round(startY);
  const pixelStack: [number, number][] = [
    [Math.round(startX), Math.round(startY)],
  ];
  const canvasWidth = ctx.canvas.width,
  canvasHeight = ctx.canvas.height;
  const startPos = (startY * canvasWidth + startX) * 4;
  const colorLayer = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const startColor: number[]= [
    colorLayer.data[startPos],
    colorLayer.data[startPos + 1],
    colorLayer.data[startPos + 2],
    colorLayer.data[startPos + 3],
  ];
  const updatedPoint: Record<string | number, boolean> = {};

  if (
    startColor[0] === fillColor[0] &&
    startColor[1] === fillColor[1] &&
    startColor[2] === fillColor[2] && 
    startColor[3] === fillColor[3]
  )
    return;
  //const newData = [];
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
    updatedPoint[pixelPos] = true
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
  if (Tool.isPixel) { 
    //
    let array = [];
    const imgData = colorLayer.data;
      for (let x = Tool.OptPixel.stepX + 1; x < canvasWidth; x += Tool.OptPixel.stepX) {
        for (let y = Tool.OptPixel.stepY + 1; y < canvasHeight; y += Tool.OptPixel.stepY) {
         let index = y * canvasWidth + x;
                let i = index * 4;
                let rgb = `rgba(${imgData[i]},${imgData[i + 1]},${
                  imgData[i + 2]
                },${imgData[i + 3]})`;
                //透明色转默认色
                if (
                  imgData[i] == 0 &&
                  imgData[i + 1] == 0 &&
                  imgData[i + 2] == 0 &&
                  imgData[i + 3] == 0
                ) {
                  array.push(Tool.OptPixel.EMPTY_COLOR);
                } else {
                  array.push(rgb);
                 }       
        }
    }
    for (let index = 0; index < array.length; index++) {
      Tool.PixelBoxs[index].setColor(array[index]);
     }
    console.log('----43546',array,Tool.PixelBoxs)
           refresh();

  }


 // ctx.putImageData(colorLayer, 0, 0);
};

/**
 * 判断两个位置的像素颜色是否相同
 */
const matchColor = (
  colorLayer: ImageData,
  pixelPos: number,
  color: number[],
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
  color:number[]| [number, number, number,number]
) => {
  
  colorLayer.data[pixelPos] = color[0];
  colorLayer.data[pixelPos + 1] = color[1];
  colorLayer.data[pixelPos + 2] = color[2];
  colorLayer.data[pixelPos + 3] = color[3]
  return colorLayer;
};

class ColorFill extends Tool {
  mouseDownTimer: any;
  private operateStart(pos: Point) {
    const showColor = parseColorString(Tool.strawColor || Tool.fillColor ||"#000000FF")
    console.time("efficentFloodFill");
    const colorArr: number[] = [showColor.r, showColor.g, showColor.b, showColor.a * 255]
    Promise.resolve().then(() => { 
      efficentFloodFill(Tool.ctx, pos.x, pos.y, colorArr);
    })
    console.timeEnd("efficentFloodFill");
  }
  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if(this.mouseDownTimer) return 
    const mousepos = getMousePos(Tool.ctx.canvas, event);
    setStraw(mousepos);
    this.operateStart(mousepos);

    this.mouseDownTimer = setTimeout(() => {
      clearTimeout(this.mouseDownTimer);
      this.mouseDownTimer = undefined;
    }, 300);
  }

  public onTouchStart(event: TouchEvent): void {
    if (event.cancelable) {
      event.preventDefault();
    }
    const touchpos = getTouchPos(event.target as HTMLCanvasElement, event);
    this.operateStart(touchpos);
  }
}

export default ColorFill;
