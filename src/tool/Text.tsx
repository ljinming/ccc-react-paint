import { fabric } from "fabric";
import Tool, { Point, setStrawColor } from "./tool";

class CanvasText extends Tool {
  textObject: any;
  static textStyle: any;
  selected: boolean;
  constructor() {
    super();
    this.selected = false;
    this.init();
  }

  init() {
    Tool.canvas.interactive = true;
  }

  static changeTextStyle(type: any, value: any) {
    CanvasText.textStyle = { ...CanvasText.textStyle, [type]: value };
  }

  initText(points: Point) {
    const newObj = {
      ...CanvasText.textStyle,
    };
    if (Tool.strawColor) {
      newObj.fill = Tool.strawColor;
    }
    this.textObject = new fabric.Textbox("", {
      left: points.x,
      top: points.y,
      width: 150,
      fontSize: 72,
      ...newObj,
      moveCursor: "pointer",
    });
    Tool.canvas.add(this.textObject);
    this.textObject.enterEditing();
  }

  onMouseDown = (options: any) => {
    if (Tool.toolType !== "TEXT") {
      return;
    }
    const { e, pointer, absolutePointer } = options;
    console.log("===3", options);
    e.preventDefault();
    if (Tool.strawFlag) {
      const show = {
        x: pointer.x * 2,
        y: pointer.y * 2,
      };
      setStrawColor(show);
      return;
    }
    if (!this.selected) {
      if (!this.textObject) {
        this.initText(absolutePointer);
      } else {
        this.textObject.exitEditing();
        this.textObject = null;
      }
    }
  };

  public onSelected(options: any): void {
    this.selected = true;
  }
  public onCancelSelected(options: any): void {
    this.selected = false;
  }
}

export default CanvasText;
