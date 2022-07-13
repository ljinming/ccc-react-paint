import { fabric } from "fabric";
import Tool, { addContext, clacArea, Point, setStrawColor } from "./tool";

class CanvasText extends Tool {
  textObject: any;
  static textStyle: any;
  selected: boolean = false;
  static selectedList: any;
  static selected: boolean;
  constructor() {
    super();
    this.init();
  }

  init() {
    Tool.canvas.interactive = true;
  }

  static changeTextStyle(type: any, value: any) {
    CanvasText.textStyle = { ...CanvasText.textStyle, [type]: value };
    if (this.selected && this.selectedList.length > 0) {
      this.selectedList.forEach((va: any) => {
        va.set(String([type]), value);
      });
      Tool.canvas.requestRenderAll();
    }
  }

  initText(points: Point) {
    const newObj = {
      fontFamily: "System Font",
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
    if (!clacArea(absolutePointer)) {
      return;
    }
    e.preventDefault();
    if (Tool.strawFlag) {
      const show = {
        x: pointer.x * 2,
        y: pointer.y * 2,
      };
      setStrawColor(show);
      return;
    }
    if (!CanvasText.selected) {
      if (!this.textObject) {
        this.initText(absolutePointer);
      } else {
        addContext();
        this.textObject.exitEditing();
        this.textObject = null;
      }
    }
  };

  public onMouseMove(options: any): void {
    if (Tool.toolType !== "TEXT") {
      this.textObject?.exitEditing();
      return;
    }
  }

  public onSelected(options: any): void {
    if (Tool.toolType !== "TEXT") {
      return;
    }
    CanvasText.selected = true;
    CanvasText.selectedList = options.selected;
  }

  public onCancelSelected(options: any): void {
    if (Tool.toolType !== "TEXT") {
      return;
    }
    CanvasText.selected = false;
    CanvasText.selectedList = [];
  }
}

export default CanvasText;
