import { numberLiteralTypeAnnotation } from "@babel/types";
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
  width: number;
  testList: any;
  
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
    this.testList = {}
  }

  private drawing(x: number, y: number,arr:string[]) {
    const context = Tool.ctx;
    if (!context) {
      return;
    } else {
      // 设置画笔的颜色和大小
      context.fillStyle = "#000"; // 填充颜色为红色
      context.lineWidth = 5; // 指定描边线的宽度
      context.font = "72px System Font";
        const { fontSize, fontFamily, color, letterSpacing, lineHeight } = this.fontStyle;
      if (context && this.fontStyle) {
        context.fillStyle = color || "#000";
        context.font = `${fontSize}px ${fontFamily}`;
        if (context.canvas && letterSpacing) {
          context.canvas.style.letterSpacing = letterSpacing;
        }
      }
      //let calcHeight = 0;
      // console.log('==45',this.textBox.style.height)
      if (arr.length > 0) { 
        arr.forEach((va, i) => { 
          const showX = x;
          const showY =  y + 60 * i
         // const showHeight = calcTextSize(fontSize, fontFamily, va)
          context.fillText(va,showX,showY);//每行字体y坐标间隔20
          
        })
        console.log('--456',x,y)
        this.testList[`${x}*${y}`]= {
          text: arr,
          posX: x,
          posy: y,
          context
        }

        this.textBox.setAttribute("style", `z-index:-1;display:none`);
        this.canvasBox.setAttribute("style", `z-index:-2`);
        this.textBox.value = "";
  }
      //drawText(context,arr,x, y)
      //drawtextWrap(context,this.textContent,x,y,this.width,this.fontStyle.fontSize)
     // context.fillText(this.textContent, x, y);
    }
  }

  private startText() {
    this.textContent = this.textBox.value;
    this.isMouseDown = false;
    const arr = this.textBox.value.split(/[(\r\n)\r\n]+/);
    this.drawing(this.mousePos.x, this.mousePos.y,arr);
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
    } else if (!this.isMouseDown ) {
      const mousePos = getMousePos(Tool.ctx.canvas, event);
      this.mousePos = mousePos;
      console.log(mousePos, this.testList)
        this._x = event.clientX - 80; // event.offsetX; // 鼠标按下时保存当前位置，为起始位置
        this._y = event.clientY - 80; //event.offsetY;
      if (this.testList[`${mousePos.x}*${mousePos.y}`]) {
        console.log('==456  选中了当前的text',)
      } else { 
        //  新建文本
    
        console.log('===345',this._x,this._y)
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
      this.textBox.setAttribute("style",textStyleStr);
      }


   
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

const drawText = function (ctx: CanvasRenderingContext2D, textList: string[],x:number, y:number) {
  if (textList.length > 0) { 
    textList.forEach(va => { 
        ctx.fillText(va, x, y );//每行字体y坐标间隔20
    })
  }
}

const calcTextSize =(fontSize:string ,fontFamily:string,text:string) =>{
        const span = document.createElement("span");
  const result: Record<string, string|number> = {}
        result.width = span.offsetWidth;
        result.height = span.offsetHeight;
        span.style.visibility = "hidden";
        span.style.fontSize = fontSize;
        span.style.fontFamily = fontFamily;
        span.style.display = "inline-block";
        document.body.appendChild(span);
        if(typeof span.textContent != "undefined"){
          span.textContent = text;
        }else{
          span.innerText = text;
        }
        result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
        result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
        return result;
      }
      //console.log(textSize("20px","Arial","abcdefg"));