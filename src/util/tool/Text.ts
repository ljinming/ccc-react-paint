import Tool, { Point, getMousePos } from "./tool";

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
  width: number ;
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
    this.fontStyle = {
      fontSize: 72,
      fontFamily: "System Font",
      ...fontType
    };
    this.width = 10;
  }

  private drawing(x: number, y: number) {
    const context = Tool.ctx;
    if (!context) {
      return;
    } else {
      // 设置画笔的颜色和大小
      context.fillStyle = "#000"; // 填充颜色为红色
      context.lineWidth = 5; // 指定描边线的宽度
      context.font = "72px System Font";
      if (context && this.fontStyle) {
        const { fontSize, fontFamily, color, letterSpacing } = this.fontStyle;
        context.fillStyle = color || "#000";
        context.font = `${fontSize}px ${fontFamily}`;
        if (context.canvas && letterSpacing) {
          context.canvas.style.letterSpacing = letterSpacing;
        }
      }
      drawtextWrap(context,this.textContent,x,y,this.width,this.fontStyle.fontSize)
     // context.fillText(this.textContent, x, y);
    }
  }

  private startText() {
    const arr = this.textBox.value.split(/[(\r\n)\r\n]+/);
        console.log('==34', arr,this.textBox.value)
    this.textContent = this.textBox.value;
    this.isMouseDown = false;
    this.textBox.value = "";
    this.textBox.setAttribute("style", `z-index:-1;display:none`);
    this.canvasBox.setAttribute("style", `z-index:-2`);
    this.drawing(this.mousePos.x, this.mousePos.y);
  }

  public onKeyDown(event: any): void {
    if (event.keyCode == 13) {
      //鼠标
      this.startText();
      event.preventDefault();
    }
  }

  public onMouseDown(event: any): void {
    // 鼠标按下位置保存
    event.preventDefault();
    if (this.isMouseDown) {
      this.startText();
    } else if (!this.isMouseDown) {
      const mousePos = getMousePos(Tool.ctx.canvas, event);
      this.mousePos = mousePos;
      this._x = event.clientX - 80; // event.offsetX; // 鼠标按下时保存当前位置，为起始位置
      this._y = event.clientY - 80; //event.offsetY;
      this.isMouseDown = true;
      this.textBox.innerText = "";
      let textStyleStr =  `display:block;
        position:absolute;
        z-index:6;
        width:auto;
        left:${this._x}px;
        top:${this._y - 10}px;
        `

       if (this.fontStyle) { 
      const { fontSize, fontFamily, color, letterSpacing } = this.fontStyle;
    textStyleStr = `${textStyleStr} font-size:${fontSize}px;font-family:${fontFamily};color:${color};letterSpacing:${letterSpacing};`;
       }
      const width = this.canvasBox.clientWidth - this._x;
      const height = this.canvasBox.clientHeight - this._y
      console.log('===46',width,this.canvasBox.clientWidth,this._x)
      textStyleStr = `${textStyleStr} width:${width}px;max-height:${height}px`
      this.width = width
      this.canvasBox.setAttribute("style", `z-index:5;display:block,pointer-events:auto`);
      this.textBox.setAttribute(  "style",textStyleStr);
    }
  }
}

export default Text;


const drawtextWrap = function (ctx: CanvasRenderingContext2D, t: string, x: number, y: number,w: number,fontSize:number)  {
  //参数说明
 // ctx：canvas的 2d 对象，t：绘制的文字，x,y:文字坐标，w：文字最大宽度
  const chr = t.split("")
  let temp = ""
  const row = []
  const showHeight = 20

  


  for (let a = 0; a < chr.length; a++) {
    if (ctx.measureText(temp).width < w && ctx.measureText(temp + (chr[a])).width <= w) {
      temp += chr[a];
     // height=Math.max(height,ctx.measureText(chr[a]).height)
    } else {
      row.push(temp);
      temp = chr[a];
    }
  }
  row.push(temp)
  for (let b = 0; b < row.length; b++) {
    ctx.fillText(row[b], x, y + (b + 1)*fontSize);//每行字体y坐标间隔20
  }

}