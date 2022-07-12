import Tool, { clacArea, getRandomColor, setStrawColor } from "./tool";

class Pen extends Tool {
  static color: string = getRandomColor();
  static lineWidth: number = 20;
  //改变画笔的状态
  constructor() {
    super();
    this.init();
  }

  init() {
    console.log("pen init", Tool.strawColor);
    if (!Tool.canvas.isDrawingMode) {
      Tool.canvas.isDrawingMode = true;
    }
    Tool.canvas.interactive = false;
    Tool.canvas.freeDrawingBrush.color = Tool.strawColor || Pen.color;
    Tool.canvas.freeDrawingBrush.width = Pen.lineWidth;
  }

  static setPenStyle(type: string, value: any) {
    Pen[type] = value;
    if (type === "lineWidth") {
      Tool.canvas.freeDrawingBrush.width = value;
    } else {
      Tool.canvas.freeDrawingBrush.color = value;
    }
  }

  public onMouseDown = (options: any) => {
    const { e, pointer, absolutePointer } = options;
    e.preventDefault();
    if (Tool.toolType === "PEN") {
      if (!clacArea(absolutePointer)) {
        Tool.canvas.isDrawingMode = false;
        return;
      }
      if (Tool.strawFlag) {
        const show = {
          x: absolutePointer.x * 2,
          y: absolutePointer.y * 2,
        };
        setStrawColor(show);
      } else {
        this.init();
      }
    }
  };
}

export default Pen;
