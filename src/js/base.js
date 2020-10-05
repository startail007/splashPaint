const createCTX = () => {
  return document.createElement("canvas").getContext("2d");
};
const setShadow = (ctx, offsetX, offsetY, blur, color) => {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
};
const clearShadow = (ctx) => {
  setShadow(ctx, 0, 0, 0, "rgba(0, 0, 0, 0)");
};
const numberCrop = (value, min, max) => {
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
};
const debounce = (func, delay = 250) => {
  let timeout = null;
  return () => {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};
const randomSeedList = new Array(200);
for (let i = 0, len = randomSeedList.length; i < len; i++) {
  randomSeedList[i] = 1 - 2 * Math.random();
}
export { createCTX, setShadow, clearShadow, numberCrop, debounce, randomSeedList };
