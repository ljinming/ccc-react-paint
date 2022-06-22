import Tool, { Point, getMousePos, } from "./tool";

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
  mousePos:Point;
  public constructor(fontType: any) {
    super();
    this._x = NaN;
    this._y = NaN;
    this.textBox = document.getElementById("textBox");
    this.canvasBox = document.getElementById("ccc-all-canvas");
    this.mousePos = {
      x: 0,
      y:0
    }
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

      // 写字
      //   const width = this.canvas.offsetWidth;
      //   console.log("----546", this.canvas);
      //   const height = this.canvas.offsetHeight;
      //   const tempImg = new Image();
      //   tempImg.width = width;
      //   tempImg.height = height;
      //   tempImg.onload = function () {
      //     // 把img绘制在canvas画布上
      //     context.drawImage(tempImg, 0, 0, width, height);
      //   };
      //   (tempImg.src =
      //     'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><foreignObject width="' +
      //     width +
      //     '" height="' +
      //     height +
      //     '"><body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;font:' +
      //     context.font +
      //     ';">' +
      //     this.textContent),
      //     +"</body></foreignObject></svg>";
      context.fillText(this.textContent, x, y);
      // this.wrapText(this.textContent, parseInt(this.textBox.style.left), parseInt(this.textBox.style.top));
    }
  }

  public onMouseDown(event: MouseEvent): void {
    // 鼠标按下位置保存

    event.preventDefault();
    if (this.isMouseDown) {
      this.textContent = this.textBox.value;
      this.isMouseDown = false;
      this.textBox.style["z-index"] = -1;
      this.textBox.setAttribute("style", `visibility:hidden;z-index:-1;`)

      this.drawing(this.mousePos.x ,this.mousePos.y);
      this.textBox.value = "";
    } else if (!this.isMouseDown) {
      const mousePos = getMousePos(Tool.ctx.canvas, event);
      this.mousePos = mousePos
      this._x =   event.clientX - 80; // 鼠标按下时保存当前位置，为起始位置
      this._y = event.clientY -80;
      this.isMouseDown = true;
      this.textBox.value = "";
      if (typeof this.fontStyle === "object") {
        Object.keys(this.fontStyle).forEach((va) => {
          this.textBox.style[va] = this.fontStyle[va];
        });
      }
      this.textBox.setAttribute("style", `position:absolute;visibility:visible;z-index:6;min-width:120px; left:${this._x}px;top:${this._y}px;`)
    }
  }
}

export default Text;
