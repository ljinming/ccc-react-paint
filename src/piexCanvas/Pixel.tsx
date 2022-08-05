export interface Point {
  x: number;
  y: number;
}

class Pixel {
  lineWidth: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  fillStyle: string | CanvasGradient | CanvasPattern;
  isFill: any;
  size: number;
  x: number;
  y: number;
  shape: string;
  filled: boolean | undefined;
  constructor(option: {
    x: number;
    y: number;
    shape: string;
    size?: number;
    fillStyle: string | CanvasGradient | CanvasPattern;
    isFill: any;
    strokeStyle: string | CanvasGradient | CanvasPattern;
  }) {
    this.lineWidth = 0;
    this.x = option.x;
    this.y = option.y;
    this.shape = option.shape;
    this.size = option.size || 16;
    this.fillStyle = option.fillStyle;
    this.isFill = option.isFill;
    this.strokeStyle = "transparent";
  }

  setColor(color: string) {
    this.fillStyle = color;
    this.filled = true;
  }

  getColor() {
    return this.fillStyle;
  }

  createPath(ctx: CanvasRenderingContext2D) {
    if (this.shape === "rect") {
      this.createRect(ctx);
    } else {
      this.createCircle(ctx);
    }
  }

  getPoints() {
    let p1 = { x: this.x - this.size / 2, y: this.y - this.size / 2 };
    let p2 = { x: this.x + this.size / 2, y: this.y - this.size / 2 };
    let p3 = { x: this.x + this.size / 2, y: this.y + this.size / 2 };
    let p4 = { x: this.x - this.size / 2, y: this.y + this.size / 2 };
    return [p1, p2, p3, p4];
  }

  createCircle(ctx: CanvasRenderingContext2D) {
    let radius = this.size / 2;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
  }

  createRect(ctx: CanvasRenderingContext2D) {
    let points = this.getPoints();
    ctx.fillRect(this.x, this.y, this.size, this.size);
    // points.forEach(function (point, i) {
    //   ctx[i == 0 ? "moveTo" : "lineTo"](point.x, point.y);
    // });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    this.createPath(ctx);
    if (this.isFill) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * @param  {Object} p {x: num, y: num}
   * @description 判断点是否在这个路径上, 构造路径利用isPointInPath判断点是否在此路径上不用绘制到canvas上
   */
  isPointInPath(ctx: CanvasRenderingContext2D, p: Point): boolean {
    let isIn = false;
    ctx.save();
    ctx.beginPath();
    this.createPath(ctx);
    if (ctx.isPointInPath(p.x, p.y)) {
      isIn = true;
    }
    ctx.closePath();
    ctx.restore();
    return isIn;
  }
}
export default Pixel;
