import Tool, { getMousePos, getTouchPos, setStraw, Point, clacArea } from "./tool";
import { parseColorString } from "./colorChange";
import { throttle, debounce } from "../../utils";
//import Color from "color";

/**
 * 高效率的填充算法
 * 参考地址: http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
 */
const efficentFloodFill = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: [number, number, number]
): ImageData | undefined => {
  // 保证 startX 和 startY 是正整数
  // 经测试，在触屏设备中 startX 和 startY 可能是小数，造成填充功能无法正确填充
  startX = Math.round(startX);
  startY = Math.round(startY);
  const pixelStack: [number, number][] = [[Math.round(startX), Math.round(startY)]];
  const canvasWidth = ctx.canvas.width,
    canvasHeight = ctx.canvas.height;
  const startPos = (startY * canvasWidth + startX) * 4;
  const colorLayer = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const startColor: [number, number, number] = [
    colorLayer.data[startPos], //r
    colorLayer.data[startPos + 1], //g
    colorLayer.data[startPos + 2] //b
    // colorLayer.data[startPos + 3], //a
  ];

  const showR = Math.abs(startColor[0] - fillColor[0]) === 10;
  const showG = Math.abs(startColor[1] - fillColor[1]) === 10;
  const showB = Math.abs(startColor[2] - fillColor[2]) === 10;
  console.log("color:", fillColor, startColor);
  if (!showB && !showG && !showR) {
    // 颜色不同
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
      while (y++ < canvasHeight - 1 && matchColor(colorLayer, pixelPos, startColor)) {
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
    // ctx.putImageData(colorLayer, 0, 0);
  }
  return undefined;
};

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
    console.log("--进来了");
    setStraw(pos);
    const color = parseColorString(Tool.strawColor || Tool.fillColor); //new Color(Tool.strawColor ||Tool.fillColor);
    if (
      (this.currentColor.r !== color.r && this.currentColor.g !== color.g && this.currentColor.b !== color.b) ||
      this.points.x !== pos.x ||
      this.points.y !== pos.y
    ) {
      this.currentColor = color;
      this.points = pos;

      this.rendering = true;
      Promise.resolve().then(() => {
        const colorLayer = efficentFloodFill(Tool.ctx, pos.x, pos.y, [color.r, color.g, color.b]);
        updateImageData(Tool.ctx, colorLayer);
        console.log(this);
        this.rendering = false;
      });
    }
  }

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();

    if (this.mouseDownTimer || this.rendering) {
      return;
    }
    const mousepos = getMousePos(Tool.ctx.canvas, event, "colorFill");
    this.operateStart(mousepos);

    // this.operateStart(mousepos);
    // debounce(this.operateStart(mousepos), 3000);

    this.mouseDownTimer = setTimeout(() => {
      clearTimeout(this.mouseDownTimer);
      this.mouseDownTimer = undefined;
    }, 10);
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
