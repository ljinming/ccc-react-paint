import { numberLiteralTypeAnnotation } from "@babel/types";
import { formatLongStrToArr } from "./colorChange";
import Tool, { Point, getMousePos, setStraw } from "./tool";

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
  client: { x: any; y: any; } | undefined;
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


  private drawingText(x: number, y: number, arr: string[]) { 
    const textArea = document.createElement("textarea")
    this.allCanvas?.appendChild(textArea);
  function mousemoveEv(e: MouseEvent) {
       if (Text.currentDown) { 
         const clacx = e.clientX - Text.currentPos.x;
          const clacy = e.clientY- Text.currentPos.y;
         textArea.style.left =  Text.currentCanvas.x + clacx + 'px'
         textArea.style.top =  Text.currentCanvas.y + clacy + 'px'
       }
     }
    textArea.setAttribute(`style`,
      `position:absolute;
      left:${this._x}px;
      background:#362F395E; 
      top: ${this._y}px;
      cursor:pointer;
      transform:scale(${Tool.currentScale});
      transform-origin: left top;`);
    
    textArea.addEventListener("mousedown", function (e) {
      textArea.style.transform = `scale(${Tool.currentScale})`
      Text.currentDown = true
      Text.currentPos = {
        x: e.clientX,
        y:e.clientY,
      }
      Text.currentCanvas = {
        x:Number(textArea.style.left.split('px')[0]),
        y:Number(textArea.style.top.split('px')[0])
      }
    textArea.addEventListener("mousemove", mousemoveEv);

    });
    textArea.addEventListener("mouseup", function (e:MouseEvent) {
      Text.currentDown = false
      textArea.removeEventListener("mousemove", mousemoveEv);
     // canvas.style.background = 'transparent';
      
      Tool.textList = {
        data: textArea,
        textArea,
        event:e,
        pos: [Number(textArea.style.left.split('px')[0])+80, Number(textArea.style.top.split('px')[0])+80,]
      }

    });
    this.calcCurrentElement(textArea)
  }

 private calcCurrentElement =(ctx:HTMLElement)=> {
 if (this.fontStyle) { 
        const { fontSize, fontFamily, color, letterSpacing } = this.fontStyle;
       ctx.setAttribute('font-size', fontSize)
        ctx.setAttribute('font-family', fontSize)
        ctx.setAttribute('color', color)
        ctx.setAttribute('letterSpacing', letterSpacing)
       }
  }



  private drawing(x: number, y: number,arr:string[]) {
    const canvas = document.createElement("canvas");
    const { fontSize, fontFamily, color, letterSpacing } = this.fontStyle;
    const canvasKey = `${new Date().getTime()}`;
    canvas.width = Math.ceil(this.textBox.clientWidth); 
    canvas.height =Math.ceil(this.textBox.clientHeight);
   // canvas.title = canvasKey
    this.allCanvas?.appendChild(canvas);

 //canvas.style.background = '#362F395E';
    
    function mousemoveEv(e: MouseEvent) {
       if (Text.currentDown) { 
         const clacx = e.clientX - Text.currentPos.x;
          const clacy = e.clientY- Text.currentPos.y;
         canvas.style.left =  Text.currentCanvas.x + clacx + 'px'
         canvas.style.top =  Text.currentCanvas.y + clacy + 'px'
       }
     }
    canvas.setAttribute(`style`,
      `position:absolute;left:${this._x}px;background:#362F395E;top:${this._y}px;cursor:pointer;transform:scale(${Tool.currentScale});transform-origin: left top;`);
   
    canvas.addEventListener("mousedown", function (e) {
      canvas.style.transform = `scale(${Tool.currentScale})`
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
     // canvas.style.background = 'transparent';
      Tool.textList[canvasKey] = {
        data: canvas.toDataURL(),
        canvas,
        event:e,
        pos: [Number(canvas.style.left.split('px')[0])+80, Number(canvas.style.top.split('px')[0])+80,]
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
      if (context && this.fontStyle) {
        context.fillStyle = color || "#000";
        context.font = `${fontSize}px ${fontFamily}`;
        if (context.canvas && letterSpacing) {
          context.canvas.style.letterSpacing = letterSpacing;
        }
      }
      let showArr: string[] = [];
      let showWidth = 0;
      arr.forEach(va => { 
        const textWidth = Number(context.measureText(va).width);
        if (textWidth > canvas.width) {
          showWidth= canvas.width
          const showNum = Math.floor((canvas.width - 14) / Math.ceil(textWidth / va.length));
          const newArr = formatLongStrToArr(va,showNum)
          showArr.push(...newArr)
        } else { 
          showWidth =Math.max(textWidth,showWidth);
          showArr.push(va)
        }
      })
      //context.canvas.width = Math.ceil(showWidth);
     // console.log('==456',showWidth,canvas.width)
      const height = Math.floor(canvas.height / showArr.length)
      if (showArr.length > 0) {
        showArr.forEach((va, i) => {
          context.fillText(va, 12, (height/2 + fontSize/2) * (i + 1));
        })
        
        Tool.textList[canvasKey] = {
          data: canvas.toDataURL(), canvas,
          pos: [this._x+80, this._y+80]
        }
        this.textBox.setAttribute("style", `z-index:-1;display:none`);
        this.canvasBox.setAttribute("style", `z-index:-2`);
        this.textBox.value = "";

      }
    }
  }

  private startText() {
    this.textContent = this.textBox.value;
    this.isMouseDown = false;
    if (this.textContent) {
      const arr = this.textBox.value.split(/[(\r\n)\r\n]+/);
      this.drawing(this.mousePos.x, this.mousePos.y, arr);
      //this.drawingText(this.mousePos.x, this.mousePos.y, arr)
    } else { 
       this.textBox.setAttribute("style", `z-index:-1;display:none`);
        this.canvasBox.setAttribute("style", `z-index:-2`);
        this.textBox.value = "";
    }
   
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
        //  event.preventDefault();
    if (event.keyCode == 8) {
      //delete 
      Object.keys(Tool.textList).forEach(va => { 
              document
                .getElementById("all-canvas")
                ?.removeChild(Tool.textList[va].canvas);
      })
      Tool.textList = {}

    }
  }

  public onMouseDown(event: any): void {
    // 鼠标按下位置保存
    event.preventDefault();
    const mousePos = getMousePos(Tool.ctx.canvas, event);
    if (Tool.strawFlag) { 
        setStraw(mousePos)
      return
    }
    if (this.isMouseDown) {
      this.startText();

    } else if (!this.isMouseDown) {
       this.drawLastText()
      this.mousePos = mousePos;
        this._x = event.clientX - 80; // event.offsetX; // 鼠标按下时保存当前位置，为起始位置
        this._y = event.clientY - 80; //event.offsetY;
        //  新建文本
      this.client = {
        x: event.clientX,
        y: event.clientY
      }
      this.isMouseDown = true;
      this.textBox.innerText = "";
      let textStyleStr =  `display:block;
        position:absolute;
        z-index:6;
        width:auto;
        left:${this._x}px;
        top:${this._y - 10}px;
        `
            const { fontSize, fontFamily, color, letterSpacing } = this.fontStyle;
       if (this.fontStyle) { 
      textStyleStr = `${textStyleStr}; font-size:${fontSize}px;font-family:${fontFamily};color:${color};letterSpacing:${letterSpacing};`;
       }
      const width = this.canvasBox.clientWidth - this._x;
      //const height = this.canvasBox.clientHeight - this._y
      textStyleStr = `${textStyleStr} max-width:${width}px;`
      if (fontSize /2 < 260) { 
        textStyleStr = `${textStyleStr} width:${260}px;`
      }
      this.width = width
      this.canvasBox.setAttribute("style", `z-index:5;display:block,pointer-events:auto`);
      this.textBox.setAttribute("style",textStyleStr);
    }
  }
}

export default Text;
