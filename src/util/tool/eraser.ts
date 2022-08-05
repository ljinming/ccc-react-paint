import { ColorType } from "../toolType";
import { drawColorToPixel, getPixelColorOnPixelBoxs, updatePixelBoxs } from "./pixelUtil";
import Tool, { Point, getMousePos, getPixelColorOnCanvas, getTouchPos, hexToRgb, updateImageData, clacArea } from "./tool";
class Eraser extends Tool {
  protected lineWidthBase = 1;
  private mouseDown = false;
  private color = "";
  private saveImageData?: ImageData;
  private previousPos: Point = {
    x: 0,
    y: 0
  };
  public constructor(lineSize:number) {
    super();
    this.lineWidthBase = lineSize;
    this.color = "";
  }
  private operateStart(pos: Point) {
    if (!Tool.ctx) return;
    this.saveImageData = Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);
    this.mouseDown = true;
    this.previousPos = pos;
        Tool.ctx.lineWidth =Tool.isPixel ? this.lineWidthBase*Tool.OptPixel.size/2: this.lineWidthBase;

    const newPos = {
      x: pos.x -   Tool.ctx.lineWidth,
      y:pos.y -   Tool.ctx.lineWidth
    }

    this.color = Tool.isPixel ? getPixelColorOnPixelBoxs(newPos) : getPixelColorOnCanvas(Tool.ctx, pos.x - 2, pos.y - 2);
            console.log(this.color)

    Tool.ctx.strokeStyle = this.color;
    Tool.ctx.lineJoin = "round";
    Tool.ctx.lineCap = "round";
    Tool.ctx.beginPath();
     if (Tool.isPixel) { 
       drawColorToPixel(pos, pos, this.color);
    }
  }
  private operateMove(pos: Point) {
    if (this.mouseDown) {
      if (Tool.isPixel) { 
				drawColorToPixel(this.previousPos, pos, this.color);
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
      if (!Tool.isPixel) { 
      let imageData = Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);
      const colorRgb = hexToRgb(this.color);
      if (colorRgb && this.saveImageData) {
        imageData = updateImageData(this.saveImageData, imageData, [colorRgb.r, colorRgb.g, colorRgb.b, colorRgb.a]);
        Tool.ctx.putImageData(imageData, 0, 0);
      }
      }
              updatePixelBoxs(Tool.ctx)

     
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

export default Eraser;


