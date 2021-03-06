import Tool from "./tool";

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
  private canvasText: any;
  public constructor(fontType: any) {
    super();
    this._x = NaN;
    this._y = NaN;
    this.textBox = document.getElementById("textBox");
    this.canvasText = document.getElementById("canvas-text");

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
      context.fillText(this.textContent, parseInt(this.textBox.style.left), parseInt(this.textBox.style.top));
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
      this.canvasText.style["z-index"] = -1;
      this.textBox.style.visibility = "hidden";
      this.drawing(this._x, this._y);
      this.textBox.value = "";
    } else if (!this.isMouseDown) {
      this._x = event.offsetX; // 鼠标按下时保存当前位置，为起始位置
      this._y = event.offsetY;
      this.isMouseDown = true;
      this.textBox.value = "";
      if (typeof this.fontStyle === "object") {
        Object.keys(this.fontStyle).forEach((va) => {
          this.textBox.style[va] = this.fontStyle[va];
        });
      }
      this.canvasText.style["z-index"] = 5;
      this.textBox.style["z-index"] = 6;
      this.textBox.style.visibility = "visible";
      this.textBox.style.left = this._x - 4 + "px";
      this.textBox.style.top = this._y - 2 + "px";
    }
  }
}

export default Text;
