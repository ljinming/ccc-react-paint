import { store } from "../Action";
import { fabric } from "fabric";
//import Action from "@/action";
import { rgbToHex } from "./colorChange";

export interface Point {
  x: number;
  y: number;
}

export interface Pencil {
  lineWidth: number;
  strokeColor: string;
}

// 随机color
export const getRandomColor = () => {
  return (
    "#" + ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  );
};

// strawColor

export const setStrawColor = (pos: Point) => {
  const ctx = Tool.canvas.getContext();
  const color = getPixelColorOnCanvas(pos, ctx);
  Tool.strawColor = color;
  Tool.strawFlag = false;
  store.dispatch({
    type: "paint.straw",
    payload: { strawColor: color, strawFlag: false },
  });

  // Action.emit("paint.straw", { strawColor: color, strawFlag: false });
};
//鼠标点颜色
export const getPixelColorOnCanvas = (
  pos: Point,
  ctx: CanvasRenderingContext2D
) => {
  const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
  return rgbToHex(p[0], p[1], p[2], p[3]);
};

export default class Tool {
  //选择的工具
  public toolType: string = "PEN";

  // canvas
  public static canvas: fabric.Canvas;
  static toolType: string;
  static img: fabric.Image;
  static strawColor: string;
  static strawFlag: boolean;
  static canvasObj = [];

  static recordTimer: any;
  static stateArr: any[] = [];
  static stateIdx: any = 0;
  static transform: string;
  static currentScale: number;
  static ToolStoreList: any[] = [];
  static imgSrc: string;
  static nextCanvas: any = [];
  static currentSelected: any;

  static afterRender() {
    if (this.recordTimer) {
      clearTimeout(this.recordTimer);
      this.recordTimer = null;
    }
    this.recordTimer = setTimeout(() => {
      this.stateArr.push(JSON.stringify(Tool.canvas));
      this.stateIdx++;
    }, 1000);
  }

  // 撤销 或 还原
  static tapHistoryBtn(flag: number) {
    // let stateIdx = this.stateIdx + flag;
    // // 判断是否已经到了第一步操作
    // if (stateIdx < 0) return;
    // // 判断是否已经到了最后一步操作
    // if (stateIdx >= this.stateArr.length) return;
    // if (this.stateArr[stateIdx]) {
    //   this.canvas.loadFromJSON(
    //     this.stateArr[stateIdx],
    //     this.canvas.renderAll.bind(this.canvas)
    //   );
    //   if (this.canvas.getObjects().length > 0) {
    //     this.canvas.getObjects().forEach((item) => {
    //       item.set("selectable", false);
    //     });
    //   }
    //   this.stateIdx = stateIdx;
    // }

    let current;
    if (this.canvas) {
      if (flag < 0 && this.ToolStoreList.length < 10) {
        const tagCanvas = this.ToolStoreList.pop();
        if (tagCanvas && this.canvas) {
          this.nextCanvas.push(tagCanvas);
          current = tagCanvas;
        }
      } else if (flag > 0 && this.nextCanvas.length > 0) {
        //回到撤回前一步
        const canvasData = this.nextCanvas.pop();
        if (canvasData) {
          current = canvasData;
        }
      }
      if (current && this.canvas) {
        let canvasTool: HTMLCanvasElement | undefined =
          document.createElement("canvas");
        canvasTool.width = current.width;
        canvasTool.height = current.height;
        canvasTool?.getContext("2d")?.putImageData(current, 0, 0);
        const url = canvasTool.toDataURL();
        this.canvas.clear();
        this.canvas.setBackgroundImage(
          url,
          (img: any) => {
            img.selectable = false;
            img.evented = false;
            this.canvas.renderAll();
          },
          { crossOrigin: "anonymous", scaleX: 0.5, scaleY: 0.5 }
        );
        canvasTool = undefined;
        //this.canvas.requestRenderAll();
      }
    }
  }

  //清空画布
  static clearAll() {
    // 获取画布中的所有对象
    if (this.canvas) {
      if (this.ToolStoreList.length > 0) {
        this.ToolStoreList = [];
        this.nextCanvas = [];
        this.canvas.clear();
        this.canvas.setBackgroundImage(Tool.imgSrc, (img: any) => {
          img.selectable = false;
          img.evented = false;
          this.canvas.renderAll();
        });
      }
    }
  }

  public onMouseDown(options: any): void {
    //
  }
  public onMouseMove(event: MouseEvent): void {
    //
  }

  public onMouseUp(event: MouseEvent): void {
    //
  }

  public onSelected(event: MouseEvent): void {}

  public onCancelSelected(event: MouseEvent): void {}

  //双击
  public onDbClick(event: MouseEvent): void {}

  public onTouchStart(event: TouchEvent): void {
    //
  }

  public onTouchMove(event: TouchEvent): void {
    //
  }

  public onTouchEnd(event: TouchEvent): void {
    //
  }

  public onKeyDown(event: KeyboardEvent): void {
    //
  }
}
