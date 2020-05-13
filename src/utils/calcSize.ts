// 计算规则参考 https://www.jianshu.com/p/773b87e3356b

const calcSize = (ratio: number) => {
  let width, height;
  if (ratio < 0.4) {
    width = 204;
    height = 510;
  } else if (ratio >= 0.4 && ratio <= 0.5) {
    width = 204;
    height = 204 / ratio;
  } else if (ratio > 0.5 && ratio < 1) {
    width = 405 * ratio;
    height = 405;
  } else if (ratio >= 1 && ratio < 1 / 0.5) {
    height = 405 * (1 / ratio);
    width = 405;
  } else if (ratio >= 1 / 0.5 && ratio < 1 / 0.4) {
    height = 204;
    width = 204 / (1 / ratio);
  } else if (ratio >= 1 / 0.4) {
    height = 204;
    width = 510;
  }
  if (width && height) {
    height /= 1.5;
    width /= 1.5;
  }
  return [width, height];
};

export default calcSize;
