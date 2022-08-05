import Tool, { Point } from "./tool";

const sqr = (x: number) => {
  return x * x;
};

const dist2 = (p1: Point, p2: Point) => {
  return sqr(p1.x - p2.x) + sqr(p1.y - p2.y);
};

export const getPixelColorOnPixelBoxs = (pos: Point): string => {
  for (let i = 0; i < Tool.PixelBoxs.length; i++) {
    const pixel = Tool.PixelBoxs[i];
    if (
      pixel.x - Tool.OptPixel.size / 2 <= pos.x &&
      pos.x <= pixel.x + Tool.OptPixel.size / 2 &&
      pixel.y - Tool.OptPixel.size / 2 <= pos.y &&
      pos.y <= pixel.y + Tool.OptPixel.size / 2
    ) {
      return pixel.getColor();
    }
  }
  return "";
};

export const updatePixelBoxs = (
  ctx: CanvasRenderingContext2D,
  imageData?: any
) => {
  const ctxWidth = ctx.canvas.width;
  const ctxHeight = ctx.canvas.height;
  const imgData = imageData || ctx.getImageData(0, 0, ctxWidth, ctxHeight).data;
  let array = [];
  for (let x = 0; x < ctxWidth; x += Tool.OptPixel.size) {
    for (let y = 0; y < ctxHeight; y += Tool.OptPixel.size) {
      let index = y * ctxWidth + x;
      let i = index * 4;
      let rgb = `rgba(${imgData[i]},${imgData[i + 1]},${imgData[i + 2]})`;
      array.push(rgb);
    }
  }
  if (Tool.PixelBoxs.length > 0) {
    for (let index = 0; index < array.length; index++) {
      Tool.PixelBoxs[index].setColor(array[index]);
    }
    refresh();
  }
};

//像素风改色功能
export const drawColorToPixel = (p1: Point, p2: Point, color: string) => {
  Tool.PixelBoxs.forEach((pixel, index) => {
    const p = {
      x: pixel.x,
      y: pixel.y,
    };
    const distance = distToSegment(p, p1, p2, Tool.ctx.lineWidth);
    if (distance <= Tool.ctx.lineWidth) {
      const pixel = Tool.PixelBoxs[index];
      pixel.setColor(color);
    }
  });
  refresh();
};

//刷新
export const refresh = () => {
  Tool.ctx.clearRect(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);
  for (let i = 0; i < Tool.PixelBoxs.length; i++) {
    const pixel = Tool.PixelBoxs[i];
    pixel.draw(Tool.ctx);
  }
};

/**
 * @description 计算线段与圆是否相交
 * @param {x: num, y: num} p 圆心点
 * @param {x: num, y: num} v 线段起始点
 * @param {x: num, y: num} w 线段终点
 */
export const distToSegmentSquared = (p: Point, v: Point, w: Point) => {
  const l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y),
  });
};

const distToSegment = (p: Point, v: Point, w: Point, offset: number) => {
  const minX = Math.min(v.x, w.x) - offset;
  const maxX = Math.max(v.x, w.x) + offset;
  const minY = Math.min(v.y, w.y) - offset;
  const maxY = Math.max(v.y, w.y) + offset;

  if ((p.x < minX || p.x > maxX) && (p.y < minY || p.y > maxY)) {
    return Number.MAX_VALUE;
  }
  return Math.sqrt(distToSegmentSquared(p, v, w));
};

export const isPointInPath = (
  ctx: CanvasRenderingContext2D,
  p: Point
): boolean => {
  let isIn = false;
  ctx.save();
  ctx.beginPath();
  if (ctx.isPointInPath(p.x, p.y)) {
    isIn = true;
  }
  ctx.closePath();
  ctx.restore();
  return isIn;
};
