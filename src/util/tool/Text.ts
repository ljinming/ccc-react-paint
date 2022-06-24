import Tool, { Point, getMousePos,clacArea } from "./tool";

// interface propsInput = {
//             x?: number,
//             y?: Number,
//             maxWidth?:Number
// }

class Text extends Tool {
  private isMouseDown = false;
  private saveImageData?: ImageData;
  private _x: number;
  private _y: number;
  private textContent: string;
  private textBox: any;
  private fontStyle: any;
  private canvas: any;
  private canvasBox: any;
  mousePos: Point;
  public constructor(fontType: any) {
    super();
    this._x = NaN;
    this._y = NaN;
    this.textBox = document.getElementById("textBox");
    this.canvasBox = document.getElementById("text-container");
    this.mousePos = {
      x: 0,
      y: 0
    };
    this.textContent = "";
    this.fontStyle = fontType;
  }

  private drawing(x: number, y: number) {
    const context = Tool.ctx;
    if (!context) {
      return;
    } else {
      // 设置画笔的颜色和大小
      context.fillStyle = "#000"; // 填充颜色为红色
      context.lineWidth = 5; // 指定描边线的宽度
      context.font = "10px";
      if (context && this.fontStyle) {
        const { fontSize = "12px", fontFamily, color, letterSpacing } = this.fontStyle;
        context.fillStyle = color || "#000";
        context.font = `${fontSize} ${fontFamily}`;
        if (context.canvas && letterSpacing) {
          context.canvas.style.letterSpacing = letterSpacing;
        }
      }
      context.fillText(this.textContent, x, y);
    }
  }

  public onMouseDown(event: any): void {
    // 鼠标按下位置保存
    event.preventDefault();
    if (this.isMouseDown) {
      this.textContent = this.textBox.value;
      this.isMouseDown = false;
      this.textBox.value = '';
      this.textBox.setAttribute("style", `z-index:-1;display:none`);
      this.canvasBox.setAttribute("style", `z-index:-2;display:none`);
      this.drawing(this.mousePos.x, this.mousePos.y);
    } else if (!this.isMouseDown) {
      const mousePos = getMousePos(Tool.ctx.canvas, event);
      this.mousePos = mousePos;
       if (clacArea(mousePos)) { 
      this._x = event.clientX - 80; // event.offsetX; // 鼠标按下时保存当前位置，为起始位置
      this._y = event.clientY - 80; //event.offsetY;
      this.isMouseDown = true;
      this.textBox.innerText = "";
        if (typeof this.fontStyle === "object") {
        Object.keys(this.fontStyle).forEach((va) => {
          this.textBox.style[va] = this.fontStyle[va];
        });
      }
      this.canvasBox.setAttribute("style", `z-index:5;display:block,pointer-events:auto`);
      this.textBox.setAttribute(
        "style",
        `display:block;position:absolute;z-index:6;width:auto; left:${this._x}px;top:${this._y}px;`
      );
          }
    }
  }
}

export default Text;
