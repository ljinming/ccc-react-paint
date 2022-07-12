import Tool, { setStrawColor } from "./tool";
import { fabric } from "fabric";
import { Point } from "./tool";

class Shape extends Tool {
  private shapeCurrent: any;
  downPoints: Point;
  upPoints: Point | undefined;
  static shapeObject: Record<string, string> = {
    shapeType: "LINE",
    border: "SOLID",
    color: "#000",
  };
  static selected: boolean = false;
  static selectedList: any[];
  constructor() {
    super();
    this.shapeCurrent = undefined;
    this.downPoints = {
      x: 0,
      y: 0,
    };
    this.upPoints = {
      x: 0,
      y: 0,
    };
    this.init();
  }

  init() {
    Tool.canvas.interactive = true;
    Tool.canvas.isDrawingMode = false;
  }

  static changeShapeType(type: string, value: string) {
    this.shapeObject[type] = value;
    const { border } = Shape.shapeObject;

    if (this.selected && this.selectedList.length > 0) {
      this.selectedList.forEach((va) => {
        if (type === "color") {
          if (border === "FILL") {
            va.set("fill", value);
            va.set("stroke", value);
          } else {
            va.set("stroke", value);
          }
        } else if (type === "border") {
          va.set("strokeDashArray", value === "DOTTED" ? [3, 3] : [0, 0]);
        }
      });
      Tool.canvas.requestRenderAll();
    }
  }

  createShape = (pointer: Point) => {
    const { shapeType, border, color } = Shape.shapeObject;
    const options: Record<string, string | number | number[]> = {
      strokeDashArray: border === "DOTTED" ? [3, 3] : [0, 0],
      stroke: Tool.strawColor || color, // 笔触颜色
    };
    if (border === "FILL") {
      options.fill = Tool.strawColor || color;
    }
    switch (shapeType) {
      case "LINE":
        this.shapeCurrent = new fabric.Line(
          [
            pointer.x,
            pointer.y, // 起始点坐标
            pointer.x,
            pointer.y, // 结束点坐标
          ],
          options
        );
        break;
      case "RECT":
        // 创建矩形
        // 矩形参数计算
        let top = Math.min(pointer.y, pointer.y);
        let left = Math.min(pointer.x, pointer.x);
        let width = Math.abs(pointer.x - pointer.x);
        let height = Math.abs(pointer.y - pointer.y);
        // 矩形对象
        this.shapeCurrent = new fabric.Rect({
          top,
          left,
          width,
          height,
          fill: "transparent",
          strokeWidth: 1,
          ...options,
        });
        break;
      case "CIRCLE":
        this.shapeCurrent = new fabric.Circle({
          top: pointer.y,
          left: pointer.x,
          radius: 0,
          fill: "transparent",
          ...options,
        });
        break;
      case "TRIANGLE":
        this.shapeCurrent = new fabric.Triangle({
          top: pointer.y,
          left: pointer.x,
          width: 0,
          height: 0,
          fill: "transparent",
          ...options,
        });
        break;
      case "RHOMBUS": //多边形
        this.shapeCurrent = new fabric.Polygon(
          [
            { x: pointer.x, y: pointer.y },
            { x: pointer.x, y: pointer.y },
          ],
          {
            fill: "transparent",
            objectCaching: false,
            ...options,
          }
        );
        break;
    }

    Tool.canvas.add(this.shapeCurrent);
  };

  changeShape = (pointer: Point) => {
    const { shapeType } = Shape.shapeObject;
    switch (shapeType) {
      case "LINE":
        if (this.shapeCurrent) {
          this.shapeCurrent.set("x2", pointer.x);
          this.shapeCurrent.set("y2", pointer.y);
        }
        break;
      case "RECT":
        if (this.shapeCurrent) {
          this.shapeCurrent.set(
            "width",
            Math.abs(this.downPoints.x - pointer.x)
          );
          this.shapeCurrent.set(
            "height",
            Math.abs(this.downPoints.y - pointer.y)
          );
        }
        break;
      case "CIRCLE":
        {
          const radius =
            Math.min(
              Math.abs(this.downPoints.x - pointer.x),
              Math.abs(this.downPoints.y - pointer.y)
            ) / 2;
          const top =
            pointer.y > this.downPoints.y
              ? this.downPoints.y
              : this.downPoints.y - radius * 2;
          const left =
            pointer.x > this.downPoints.x
              ? this.downPoints.x
              : this.downPoints.x - radius * 2;

          this.shapeCurrent.set("radius", radius);
          this.shapeCurrent.set("top", top);
          this.shapeCurrent.set("left", left);
        }
        break;
      case "TRIANGLE":
        {
          const width = Math.abs(this.downPoints.x - pointer.x);
          const height = Math.abs(this.downPoints.y - pointer.y);
          const top = Math.min(this.downPoints.y, pointer.y);
          const left = Math.min(this.downPoints.x, pointer.x);
          this.shapeCurrent.set("width", width);
          this.shapeCurrent.set("height", height);
          this.shapeCurrent.set("top", top);
          this.shapeCurrent.set("left", left);
        }
        break;
      case "RHOMBUS": //多边形
        let points = this.shapeCurrent.points;
        points.push({
          x: pointer.x,
          y: pointer.y,
        });
        break;
    }
    Tool.canvas.requestRenderAll();
  };

  // 多边形橡皮带
  changePolygonBelt(pointer: Point) {
    let points = this.shapeCurrent.points;
    points[points.length - 1].x = pointer.x;
    points[points.length - 1].y = pointer.y;
    Tool.canvas.requestRenderAll();
  }
  // 完成多边形绘制
  finishPolygon(pointer: Point) {
    const { shapeType, border, color } = Shape.shapeObject;
    const options = {
      strokeDashArray: border === "SOLID" ? [0, 0] : [3, 3],
      stroke: Tool.strawColor || color, // 笔触颜色
    };
    let points = this.shapeCurrent.points;
    if (points[points.length - 1]) {
      points[points.length - 1].x = pointer.x;
      points[points.length - 1].y = pointer.y;
    }

    points.pop();
    points.pop();
    Tool.canvas.remove(this.shapeCurrent);
    if (points.length > 1) {
      let polygon = new fabric.Polygon(points, {
        fill: "transparent",
        ...options,
      });

      Tool.canvas.add(polygon);
    }

    this.shapeCurrent = null;
    Tool.canvas.requestRenderAll();
  }

  onMouseDown(options: any): void {
    if (Tool.toolType !== "SHAPE") {
      return;
    }
    const { e, absolutePointer } = options;
    console.log("===4", options);
    this.downPoints = absolutePointer; //鼠标按下的位置
    if (Tool.strawFlag) {
      const show = {
        x: absolutePointer.x * 2,
        y: absolutePointer.y * 2,
      };
      setStrawColor(show);
      return;
    }
    const { shapeType } = Shape.shapeObject;
    e.preventDefault();
    if (!Shape.selected) {
      if (shapeType === "RHOMBUS") {
        if (!this.shapeCurrent) {
          this.createShape(absolutePointer);
        } else {
          this.changeShape(absolutePointer);
        }
      } else if (!this.shapeCurrent) {
        this.createShape(absolutePointer);
      }
    }
  }

  public onMouseMove(options: any): void {
    if (Tool.toolType === "SHAPE") {
      const { e, absolutePointer } = options;
      e.preventDefault();
      const { shapeType } = Shape.shapeObject;
      e.preventDefault();
      if (this.shapeCurrent) {
        if (shapeType === "RHOMBUS") {
          this.changePolygonBelt(absolutePointer);
        } else {
          this.changeShape(absolutePointer);
        }
      }
    }
  }

  public onMouseUp(options: any): void {
    if (Tool.toolType !== "SHAPE") {
      return;
    }
    const { e, absolutePointer } = options;
    const { shapeType } = Shape.shapeObject;
    e.preventDefault();
    if (shapeType !== "RHOMBUS") {
      this.upPoints = absolutePointer;
      if (JSON.stringify(this.downPoints) === JSON.stringify(this.upPoints)) {
        Tool.canvas.remove(this.shapeCurrent);
      }
      this.shapeCurrent = undefined;
    }
  }

  public onDbClick(options: any): void {
    if (Tool.toolType !== "SHAPE") {
      return;
    }
    const { shapeType } = Shape.shapeObject;
    const { e, absolutePointer } = options;
    e.preventDefault();
    if (shapeType === "RHOMBUS" && this.shapeCurrent) {
      this.finishPolygon(absolutePointer);
    }
  }

  public onSelected(options: any): void {
    if (Tool.toolType !== "SHAPE") {
      return;
    }
    Shape.selected = true;
    Shape.selectedList = options.selected;
  }
  public onCancelSelected(options: any): void {
    if (Tool.toolType !== "SHAPE") {
      return;
    }
    Shape.selected = false;
    Shape.selectedList = [];
  }
}

export default Shape;
