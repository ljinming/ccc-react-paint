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
