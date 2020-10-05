import { Vector } from "./vector";
import Paint from "./paint";
import { circleToCircleTangentPoint } from "./circle";
import { Point } from "./point";
import { createCTX, setShadow, clearShadow } from "./base";
import Bucket from "./bucket";
//內插法
const lagrangeInterpolation = (data, x) => {
  let fun = (data, x) => {
    let y = 0;
    const len = data.length;
    for (let i = 0; i < len; ++i) {
      let a = 1,
        b = 1;
      for (let j = 0; j < len; ++j) {
        if (j == i) continue;
        a *= x - j / (len - 1);
        b *= i / (len - 1) - j / (len - 1);
      }
      y += (data[i] * a) / b;
    }
    return y;
  };
  if (typeof data[0] == "number") {
    return fun(data, x);
  } else if (typeof data[0] == "object") {
    if (data[0] instanceof Array) {
      return data[0].map((el, index) =>
        fun(
          data.map((val) => val[index]),
          x
        )
      );
    }
  }
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ctx01 = createCTX();
const ctx02 = createCTX();

let cWidth;
let cHeight;
const mPos = [0, 0];
let volume = 20;
let color;
let start = true;
let prev_mPos = mPos.slice();
let mousedown = false;
const bucketList = [];

let fps = 0;
let oldTime = Date.now();

window.addEventListener("mousemove", (e) => {
  mPos[0] = e.offsetX;
  mPos[1] = e.offsetY;
});
window.addEventListener("mousedown", (e) => {
  mousedown = true;
  volume = 20;
  color = `hsla(${360 * Math.random()},100%,50%)`;
  start = false;
});
window.addEventListener("mouseup", (e) => {
  mousedown = false;
  const v = Vector.sub(mPos, prev_mPos);
  const a = Math.atan2(v[1], v[0]);
  const directVelocity = Vector.scale([Math.cos(a), Math.sin(a)], Math.min(Vector.length(v), 40));
  const bucket = new Bucket();
  bucket.splash(mPos, volume, directVelocity, color);
  bucketList.push(bucket);
});
window.addEventListener("resize", () => {
  init();
});

const init = () => {
  cWidth = ctx.canvas.width = ctx01.canvas.width = ctx02.canvas.width = window.innerWidth;
  cHeight = ctx.canvas.height = ctx01.canvas.height = ctx02.canvas.height = window.innerHeight;
  update();
};
const update = () => {
  prev_mPos = mPos.slice();
  bucketList.forEach((el) => el.update());
};
const render = () => {
  //ctx01.clearRect(0, 0, cWidth, cHeight);
  //ctx01.fillStyle = "#000000";
  //ctx01.fillRect(0, 0, cWidth, cHeight);

  /*ctx01.save();
  ctx01.globalCompositeOperation = "destination-out";
  ctx01.fillStyle = "rgba(0,0,0,0.01)";
  ctx01.fillRect(0, 0, cWidth, cHeight);
  ctx01.restore();*/

  /*ctx01.lineJoin = "round";
  ctx01.lineCap = "round";*/

  bucketList.forEach((el) => el.render(ctx01));

  ctx02.clearRect(0, 0, cWidth, cHeight);

  if (mousedown) {
    ctx02.save();
    setShadow(ctx02, 0, 0, 10, "rgba(0,0,0,0.5)");
    volume++;
    volume = Math.min(volume, 40);
    ctx02.fillStyle = color;
    ctx02.beginPath();
    ctx02.arc(mPos[0], mPos[1], volume, 0, 2 * Math.PI, true);
    ctx02.fill();
    ctx02.restore();
  }
  if (start) {
    ctx02.save();
    ctx02.font = "bold 32px Noto Sans TC";
    ctx02.textAlign = "center";
    ctx02.textBaseline = "hanging";
    ctx02.fillStyle = "#f0f0f0";
    ctx02.fillText("滑鼠按住集氣油漆，放開的瞬間移動方向可改變潑灑方位。", cWidth * 0.5, cHeight * 0.5);
    ctx02.restore();
  }

  ctx02.save();
  ctx02.font = "bold 18px Noto Sans TC";
  ctx02.textAlign = "start";
  ctx02.textBaseline = "hanging";
  ctx02.fillStyle = "#ff0000";
  ctx02.fillText(fps.toFixed(1), 10, 10);
  ctx02.restore();

  ctx.clearRect(0, 0, cWidth, cHeight);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);
  ctx.drawImage(ctx01.canvas, 0, 0);
  ctx.drawImage(ctx02.canvas, 0, 0);
};
const animate = () => {
  requestAnimationFrame(animate);
  const nowTime = Date.now();
  const delta = (nowTime - oldTime) / 1000;
  oldTime = nowTime;
  fps = 1 / delta;
  update();
  render();
};
init();
animate();
