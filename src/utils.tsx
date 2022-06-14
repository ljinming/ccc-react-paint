export function getImageColor(data: any, img: any) {
  let r = 0,
    g = 0,
    b = 0;
  // 取所有像素的平均值
  for (let row = 0; row < img.height; row++) {
    for (let col = 0; col < img.width; col++) {
      r += data[(img.width * row + col) * 4];
      g += data[(img.width * row + col) * 4 + 1];
      b += data[(img.width * row + col) * 4 + 2];
    }
  }

  // 求取平均值
  r /= img.width * img.height;
  g /= img.width * img.height;
  b /= img.width * img.height;

  // 将最终的值取整
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return "rgb(" + r + "," + g + "," + b + ")";
}

export function getImageSize(url: string): Promise<{
  width: number;
  height: number;
}> {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload = function () {
      resolve({
        width: image.width,
        height: image.height
      });
    };
    image.onerror = function () {
      reject(new Error("error"));
    };
    image.src = url;
  });
}
