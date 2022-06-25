interface size {
  width: number;
  height: number;
}

export function getScale(boxdom: size, img: size) {
  const scale = 1;
  let scalex = 1;
  let scaley = 1;

  if (img.width > boxdom.width) {
    scalex = boxdom.width / img.width;
  }

  if (img.height > boxdom.height) {
    scaley = boxdom.height / img.height;
  }

  return Math.min(scale, scalex, scaley);
}

// 生成节流函数

export class Throttle {
  private timer: NodeJS.Timeout | undefined;
  private stop: boolean;
  private death: boolean;
  constructor() {
    this.timer = undefined;
    this.stop = false;
    this.death = false;
  }
  public use(func: any, delay: number, immediate = false) {
    let flag = true;
    return (...args: any) => {
      if (this.death) {
        func.apply(this, args);
        return;
      }
      if (this.stop) {
        func.apply(self, args);
        return;
      }
      if (immediate) {
        func.apply(this, args);
        immediate = false;
        return;
      }
      if (!flag) {
        return;
      }
      flag = false;
      this.timer = setTimeout(() => {
        func.apply(this, args);
        flag = true;
      }, delay);
    };
  }

  // 销毁
  public destroy() {
    this.death = true;
    this.stop = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  // 开启
  public open() {
    if (!this.death) {
      this.stop = false;
    }
  }

  // 关闭
  public close() {
    this.stop = true;
  }
}

// export function throttle(time: number = 0.3) {
//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor
//   ) {
//     let oldFun = descriptor.value;
//     let isLock = false;
//     descriptor.value = function (...args: any[]) {
//       if (isLock) {
//         return;
//       }
//       isLock = true;
//       setTimeout(() => {
//         isLock = false;
//       }, time * 1000);
//       oldFun.apply(this, args);
//     };
//     return descriptor;
//   };
// }
