import { ColorType } from "../toolType";
import { hexToRgba, } from "../colorChange";
import Tool, { Point, getMousePos, setStraw, getTouchPos, hexToRgb,clacArea, updateImageData } from "./tool";
import { drawColorToPixel, isPointInPath } from "./pixelUtil";

class Pen extends Tool {
  protected lineWidthBase = 1;
  protected drawColorType = ColorType.MAIN;
  protected eraser = "";
  private mouseDown = false;
  private saveImageData?: ImageData;
  private previousPos: Point = {
    x: 0,
    y: 0
  };
  penColor: string ='' ;
  private operateStart(pos: Point) {
    if (!Tool.ctx) return;
        setStraw(pos);
  this.mouseDown = true;
    const showColor = Tool.strawColor
      ? Tool.strawColor
      : this.drawColorType === ColorType.MAIN
      ? Tool.mainColor
        : Tool.subColor;
    const testColor = hexToRgba(showColor)
        this.previousPos = pos;
    this.penColor = testColor
    Tool.ctx.lineWidth = Tool.isPixel ? Tool.lineWidthFactor * this.lineWidthBase * Tool.OptPixel.size/2 : Tool.lineWidthFactor * this.lineWidthBase;
    this.saveImageData = Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);
    Tool.ctx.strokeStyle = testColor;
    Tool.ctx.lineJoin = "round";
    Tool.ctx.lineCap = "round";
    Tool.ctx.beginPath();
    if (Tool.isPixel) { 
       drawColorToPixel(pos, pos, this.penColor);
    }
    }
    
  private operateMove(pos: Point) {
    if (this.mouseDown) {
      if (Tool.isPixel ) {
        drawColorToPixel(this.previousPos, pos, this.penColor);
        this.previousPos = pos;
        return
      } 
      Tool.ctx.moveTo(this.previousPos.x, this.previousPos.y);
      const c = 0.5 * (this.previousPos.x + pos.x);
      const d = 0.5 * (this.previousPos.y + pos.y);
      Tool.ctx.quadraticCurveTo(c, d, pos.x, pos.y);
      Tool.ctx.stroke();
      this.previousPos = pos;
    }
  }
  private operateEnd() {
    if (this.mouseDown) {
      Tool.ctx.closePath();
      this.mouseDown = false;
    //  let imageData = Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);
    //    const showColor = Tool.strawColor
    //   ? Tool.strawColor
    //   : this.drawColorType === ColorType.MAIN
    //   ? Tool.mainColor
    //        : Tool.subColor;
    //       const testColor = hexToRgba(showColor)
    // const rgbaColor = parseColorString(testColor)
    //   const colorRgb = hexToRgb(showColor);
    //   if (colorRgb && this.saveImageData) {
    //     imageData = updateImageData(this.saveImageData, imageData, [colorRgb.r, colorRgb.g, colorRgb.b, 0.5]);
    //     Tool.ctx.putImageData(imageData, 0, 0);
    //   }
    }
  }
  
  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    const mousePos = getMousePos(Tool.ctx.canvas, event);
    if (clacArea(mousePos)) { 
    this.operateStart(mousePos);
    }

  }

  public onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    this.operateEnd();
  }

  public onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const mousePos = getMousePos(Tool.ctx.canvas, event);
    this.operateMove(mousePos);
  }

  public onTouchStart(event: TouchEvent): void {
    if (event.cancelable) {
      event.preventDefault();
    }
    const touchPos = getTouchPos(event.target as HTMLCanvasElement, event);
    this.operateStart(touchPos);
  }

  public onTouchMove(event: TouchEvent): void {
    if (event.cancelable) {
      event.preventDefault();
    }
    const touchPos = getTouchPos(event.target as HTMLCanvasElement, event);
    this.operateMove(touchPos);
  }

  public onTouchEnd(event: TouchEvent): void {
    if (event.cancelable) {
      event.preventDefault();
    }
    this.operateEnd();
  }
}

export default Pen;
