import { numberLiteralTypeAnnotation } from "@babel/types";
import Tool, { Point, getMousePos } from "./tool";

// interface propsInput = {
//             x?: number,
//             y?: Number,
//             maxWidth?:Number
// }

class Text extends Tool {
  private isMouseDown = false;
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
  allCanvas: HTMLElement | null;
  static currentDown: boolean;
  static currentPos: { x: number; y: number; };
  static currentCanvas: { x: number; y: number; };
  static canvasList: Record<string, any> = {};
  public constructor(fontType: any) {
    super();
    this._x = NaN;
    this._y = NaN;
    this.textBox = document.getElementById("textBox");
    this.canvasBox = document.getElementById("text-container");
    this.allCanvas  = document.getElementById("all-canvas")
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
    const canvas = document.createElement("canvas");
    const { fontSize, fontFamily, color, letterSpacing } = this.fontStyle;
    const canvasKey = `${new Date().getTime()}`;
    canvas.width = this.textBox.clientWidth; 
    canvas.height =arr.length *fontSize ; 
    canvas.title = canvasKey
    this.allCanvas?.appendChild(canvas);

  function mousemoveEv  (e:MouseEvent) {
       if (Text.currentDown) { 
         const clacx = e.clientX - Text.currentPos.x;
          const clacy = e.clientY- Text.currentPos.y;
         canvas.style.left =  Text.currentCanvas.x + clacx + 'px'
         canvas.style.top =  Text.currentCanvas.y + clacy + 'px'
       }
     }


    canvas.setAttribute(`style`,
      `position:absolute;left:${this._x}px; top: ${this._y}px;cursor:pointer;transform:scale(${Tool.currentScale});transform-origin: left top;`);

    canvas.addEventListener("mousedown", function (e) {
      canvas.style.transform = `scale(${Tool.currentScale})`
      canvas.style.background = '#362F395E';
      Text.currentDown = true
      Text.currentPos = {
        x: e.clientX,
        y:e.clientY,
      }
      Text.currentCanvas = {
        x:Number(canvas.style.left.split('px')[0]),
        y:Number(canvas.style.top.split('px')[0])
      }
    canvas.addEventListener("mousemove", mousemoveEv);

    });
    canvas.addEventListener("mouseup", function (e:MouseEvent) {
      Text.currentDown = false
      canvas.removeEventListener("mousemove", mousemoveEv);
     canvas.style.background = 'transparent';
      Tool.textList[canvasKey] = {
        data: canvas.toDataURL(),
        canvas,
        event:e,
        pos: [Number(canvas.style.left.split('px')[0]), Number(canvas.style.top.split('px')[0]),]
      }

     });
    

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    } else {
      // 设置画笔的颜色和大小
      context.fillStyle = "#000"; // 填充颜色为红色
      context.lineWidth = 5; // 指定描边线的宽度
      context.font = "72px System Font";
      const text = context.measureText(arr[0]);
      canvas.width = text.width + 20;
      if (context && this.fontStyle) {
        context.fillStyle = color || "#000";
        context.font = `${fontSize}px ${fontFamily}`;
        if (context.canvas && letterSpacing) {
          context.canvas.style.letterSpacing = letterSpacing;
        }
      }

      if (arr.length > 0) {
        arr.forEach((va, i) => {
          context.fillText(va, 12, (fontSize / 2 + 20) * (i + 1));
        })
        
        Tool.textList[canvasKey] = { data: canvas.toDataURL(),canvas, pos: [this._x,this._y] }
        this.textBox.setAttribute("style", `z-index:-1;display:none`);
        this.canvasBox.setAttribute("style", `z-index:-2`);
        this.textBox.value = "";
      }
    }
  }

  private startText() {
    this.textContent = this.textBox.value;
    this.isMouseDown = false;
    const arr = this.textBox.value.split(/[(\r\n)\r\n]+/);
    this.drawing(this.mousePos.x, this.mousePos.y,arr);
  }


  private drawLastText() { 
   Object.keys(Tool.textList).forEach((va) => {
      const { data, pos } = Tool.textList[va];
      const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = data;
              img.onload = function () {
                /*1.在canvas 中绘制图像*/
                const { x, y } = getMousePos(
                  Tool.ctx.canvas,
                  undefined,
                  undefined,
                  {
                    x: pos[0],
                    y: pos[1],
                  }
                );
                Tool.ctx.drawImage(img, x, y);
              };
              document
                .getElementById("all-canvas")
                ?.removeChild(Tool.textList[va].canvas);
   });
    Tool.textList = {}
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
      this.drawLastText()
      this.startText();

    } else if (!this.isMouseDown ) {
      const mousePos = getMousePos(Tool.ctx.canvas, event);
      this.mousePos = mousePos;
        this._x = event.clientX - 80; // event.offsetX; // 鼠标按下时保存当前位置，为起始位置
        this._y = event.clientY - 80; //event.offsetY;
        //  新建文本
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
      textStyleStr = `${textStyleStr} max-width:${width}px;max-height:${height}px`
      this.width = width
      this.canvasBox.setAttribute("style", `z-index:5;display:block,pointer-events:auto`);
      this.textBox.setAttribute("style",textStyleStr);
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