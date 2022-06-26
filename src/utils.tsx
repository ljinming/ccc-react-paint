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

export const getRandomColor = () => {
  return "#" + ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6);
};

export function throttle(fn: any, delay: number) {
  //let prev = Date.now();
  let timer: any;
  //console.log("prev==46----3", timer);

  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      // 此处设置apply 是为了保证函数上下文不改变
      fn();
      clearTimeout(timer);
    }, delay);
  };
  // return function () {
  //   const now = Date.now();
  //   if (now - prev > delay) {
  //     fn();
  //     prev = Date.now();
  //   }
  // };
}

export function debounce(fn: any, wait: number) {
  let timer: any = null;
  //console.log("=46");
  return function () {
    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn();
    }, wait);
  };
}
