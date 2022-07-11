export const efficentFloodFill = (
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: [number, number, number]
) => {
  // 保证 startX 和 startY 是正整数
  // 经测试，在触屏设备中 startX 和 startY 可能是小数，造成填充功能无法正确填充
  startX = Math.round(startX);
  startY = Math.round(startY);
  const pixelStack: [number, number][] = [
    [Math.round(startX), Math.round(startY)],
  ];
  const canvasWidth = imageData.width,
    canvasHeight = imageData.height;
  const startPos = (startY * canvasWidth + startX) * 4;
  const colorLayer = imageData;
  const startColor: [number, number, number] = [
    colorLayer.data[startPos],
    colorLayer.data[startPos + 1],
    colorLayer.data[startPos + 2],
  ];
  const updatedPoint: Record<string | number, boolean> = {};
  if (
    startColor[0] === fillColor[0] &&
    startColor[1] === fillColor[1] &&
    startColor[2] === fillColor[2]
  ) {
    return imageData;
  }
  while (pixelStack.length > 0) {
    const newPos = pixelStack.pop() as [number, number];
    const x = newPos[0];
    let y = newPos[1];
    let pixelPos = (y * canvasWidth + x) * 4;
    while (y-- >= 0 && matchColor(colorLayer, pixelPos, startColor)) {
      pixelPos -= canvasWidth * 4;
    }
    pixelPos += canvasWidth * 4;
    ++y;
    let reachLeft = false,
      reachRight = false;

    if (updatedPoint[pixelPos]) {
      continue;
    }
    updatedPoint[pixelPos] = true;
    // newData.push(pixelPos);
    while (
      y++ < canvasHeight - 1 &&
      matchColor(colorLayer, pixelPos, startColor)
    ) {
      fillPixel(colorLayer, pixelPos, fillColor);
      if (x > 0) {
        if (matchColor(colorLayer, pixelPos - 4, startColor)) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < canvasWidth - 1) {
        if (matchColor(colorLayer, pixelPos + 4, startColor)) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      pixelPos += canvasWidth * 4;
    }
  }
  return colorLayer;
};

/*color 对比*/
/**
 * 判断两个位置的像素颜色是否相同
 */
const matchColor = (
  colorLayer: ImageData,
  pixelPos: number,
  color: [number, number, number]
) => {
  const r = colorLayer.data[pixelPos];
  const g = colorLayer.data[pixelPos + 1];
  const b = colorLayer.data[pixelPos + 2];

  return (
    Math.abs(r - color[0]) < 20 &&
    Math.abs(g - color[1]) < 20 &&
    Math.abs(b - color[2]) < 20
  );
};

/**
 * 修改指定ImageData的指定位置像素颜色
 */
const fillPixel = (
  colorLayer: ImageData,
  pixelPos: number,
  color: [number, number, number]
) => {
  colorLayer.data[pixelPos] = color[0];
  colorLayer.data[pixelPos + 1] = color[1];
  colorLayer.data[pixelPos + 2] = color[2];

  //return colorLayer;
  return colorLayer;
};

export const getTrans = (
  client: number,
  newScale: number,
  direction: string,
  img: any,
  boxdom: any,
  scale: number,
  translatex: number,
  translatey: number
) => {
  const lastTrans = direction === "width" ? translatex : translatey;
  // console.log("已经偏移的距离:", lastTrans);

  const sizeChanage = img[direction] * newScale - img[direction] * scale;
  // console.log(`img ${direction}放大了:`, sizeChanage);

  // 整体已经移动过了，需要弥补回来
  const pre = client - lastTrans - boxdom[direction === "width" ? "x" : "y"];

  //console.log("缩放中心到边界的距离", pre);

  const percent = pre / (img[direction] * scale);

  //  console.log("当前缩放尺度下，缩放中心到边界比例", percent);

  const trans = percent * sizeChanage;
  // console.log("缩放中心移动的距离:", trans);
  return trans;
};
