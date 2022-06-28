import Tool, { getMousePos, getTouchPos, setStraw, Point, clacArea } from "./tool";
import { parseColorString } from "./colorChange";
import { throttle, debounce } from "../../utils";
import { start } from "repl";
//import Color from "color";

/**
 * 高效率的填充算法
 * 参考地址: http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
 */

export const efficentFloodFill = (
  ctx: CanvasRenderingContext2D,
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
  const canvasWidth = ctx.canvas.width,
  canvasHeight = ctx.canvas.height;
  const startPos = (startY * canvasWidth + startX) * 4;
  const colorLayer = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const startColor: [number, number, number] = [
    colorLayer.data[startPos],
    colorLayer.data[startPos + 1],
    colorLayer.data[startPos + 2],
  ];
  const updateList =[]

  if (
    startColor[0] === fillColor[0] &&
    startColor[1] === fillColor[1] &&
    startColor[2] === fillColor[2]
  )
    return undefined;
  while (pixelStack.length > 0) {
    const newPos = pixelStack.pop() as [number, number];

    const x = newPos[0];
    let y = newPos[1];
    let pixelPos = (y * canvasWidth + x) * 4;
    if (updateList.indexOf(pixelPos) !== -1) { 
      continue
    }

    while (y-- >= 0 && matchColor(colorLayer, pixelPos, startColor)) {
      pixelPos -= canvasWidth * 4;
    }
    pixelPos += canvasWidth * 4;
    ++y;
      updateList.push(pixelPos)

    let reachLeft = false,
      reachRight = false;
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
  //ctx.putImageData(colorLayer, 0, 0);
};

// const efficentFloodFill = (
//   ctx: CanvasRenderingContext2D,
//   startX: number,
//   startY: number,
//   fillColor: [number, number, number] //要填充的色值
// ): ImageData | undefined => {
//   // 保证 startX 和 startY 是正整数
//   // 经测试，在触屏设备中 startX 和 startY 可能是小数，造成填充功能无法正确填充
//   startX = Math.round(startX);
//   startY = Math.round(startY);
//   // const currentStack = [Math.round(startX), Math.round(startY)];
//   const pixelStack: [number, number][] = [[Math.round(startX), Math.round(startY)]];
//   const canvasWidth = ctx.canvas.width,
//     canvasHeight = ctx.canvas.height;
//   const startPos = (startY * canvasWidth + startX) * 4;
//   const colorLayer = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
//   const startColor: [number, number, number] = [
//     colorLayer.data[startPos], //r
//     colorLayer.data[startPos + 1], //g
//     colorLayer.data[startPos + 2] //b
//     // colorLayer.data[startPos + 3], //a
//   ]; //当前点的色值

//   //const list = new Set();

//   const updatedPoint: Record<string | number, boolean> = {};

//   const updateList =[]
//   const showR = startColor[0] === fillColor[0];
//   const showG = startColor[1] === fillColor[1];
//   const showB = startColor[2] === fillColor[2];
//   console.log("color:", fillColor, startColor, pixelStack);
//   const start = new Date().getTime();
//   console.log('start', start);
//  // let curentX = startX;
//   if (!showB && !showG && !showR) {
//     // 颜色不同
//      let y_top = 0;
//       let y_bottom = 0;
//       let x_left = 0;
//     let x_right = 0;
//     //const calcR = 1500;
//     while (pixelStack.length > 0) {
//       //当前点存在
//       const newPos = pixelStack.pop() as [number, number];
//       const x = newPos[0];
//       let y = newPos[1];
//       let pixelPos = (y * canvasWidth + x) * 4;
      
//       // if (updateList.indexOf(pixelPos) !== -1) {
//       //   continue;
//       // }

//       // if (updatedPoint[pixelPos]) { 
//       //   continue
//       // }

//       while (y >= 0 && matchColor(colorLayer, pixelPos, startColor)) {
//         //当前点的颜色相同
//         pixelPos -= canvasWidth * 4;
//         y--;
//         y_bottom++
//       }
//       pixelPos += canvasWidth * 4;
//       ++y; //->找到y边界，pixelPos
//       // 更新当前x坐标下的y
//       while (y < canvasHeight - 1 && matchColor(colorLayer, pixelPos, startColor)) {
//         fillPixel(colorLayer, pixelPos, fillColor);
//        // updatedPoint[pixelPos] = true;
//         //updateList.push(pixelPos)
//         if (x > 0) {
//           // 向x轴左找
//           x_left++
//           if (matchColor(colorLayer, pixelPos - 4, startColor)) {
//             pixelStack.push([x - 1, y]);
//           }
//         }
//         if (x < canvasWidth - 1) {
//           // 向x轴右找
//            x_right++ 
//           if (matchColor(colorLayer, pixelPos + 4, startColor)) {
//             pixelStack.push([x + 1, y]);
//           }
        
//         }
//         pixelPos += canvasWidth * 4;
//         y++;
//         y_top++
//       }
//     }
//         console.log('end',new Date().getTime(),new Date().getTime()-start);
//     return colorLayer;
//   }

  
//   return undefined;
// };


// const cals
// const floodFill = (fillColor, colorLayer, pixelPos,startColor) => { 
//   let currentLayer = colorLayer;

//   if (matchColor(currentLayer, pixelPos, startColor)) { 
//     currentLayer = fillPixel(colorLayer, pixelPos, fillColor);
    
//   }





//}

const updateImageData = (ctx: CanvasRenderingContext2D, colorLayer: ImageData | undefined) => {
  if (colorLayer) {
    ctx.putImageData(colorLayer, 0, 0);
  }
};

/**
 * 判断两个位置的像素颜色是否相同
 */
const matchColor = (colorLayer: ImageData, pixelPos: number, color: [number, number, number]) => {
  const r = colorLayer.data[pixelPos];
  const g = colorLayer.data[pixelPos + 1];
  const b = colorLayer.data[pixelPos + 2];
  //const a = colorLayer.data[pixelPos + 3];
  const showR = Math.abs(r - color[0]) < 20;
  const showG = Math.abs(g - color[1]) < 20;
  const showB = Math.abs(b - color[2]) < 20;

  return showR && showG && showB;

  //return r === color[0] && g === color[1] && b === color[2] && a  === color[3];
};

/**
 * 修改指定ImageData的指定位置像素颜色
 */
const fillPixel = (colorLayer: ImageData, pixelPos: number, color: [number, number, number]) => {
  colorLayer.data[pixelPos] = color[0];
  colorLayer.data[pixelPos + 1] = color[1];
  colorLayer.data[pixelPos + 2] = color[2];
  return colorLayer;
};

class ColorFill extends Tool {
  currentColor: any;
  points: any;
  mouseDownTimer: NodeJS.Timeout | undefined; // 用来mouseDown timer
  rendering: boolean = false;
  constructor() {
    super();
    this.currentColor = {};
    this.points = {};
    this.mouseDownTimer = undefined;
  }
  private async operateStart(pos: Point) {
    setStraw(pos);
    const color = parseColorString(Tool.strawColor || Tool.fillColor); //new Color(Tool.strawColor ||Tool.fillColor);
    if (
      (this.currentColor.r !== color.r && this.currentColor.g !== color.g && this.currentColor.b !== color.b) ||
      this.points.x !== pos.x ||
      this.points.y !== pos.y
    ) {
      this.currentColor = color;
      this.points = pos;
      Promise.resolve().then(() => {
        const colorLayer = efficentFloodFill(Tool.ctx, pos.x, pos.y, [color.r, color.g, color.b]);
        updateImageData(Tool.ctx, colorLayer);
        this.rendering = false;
      });
    }
  }

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if (this.mouseDownTimer && this.rendering) {
      return;
    }
    const mousepos = getMousePos(Tool.ctx.canvas, event, "colorFill");
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
