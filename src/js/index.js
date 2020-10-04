import { Vector } from "./vector";
import { Paint } from "./paint";
import { circleToCircleTangentPoint } from "./circle";
import { Point } from "./point";
import { setShadow, clearShadow } from "./base";
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
const canvas01 = document.getElementById("canvas01");
const ctx01 = canvas01.getContext("2d");

const canvas02 = document.getElementById("canvas02");
const ctx02 = canvas02.getContext("2d");
let cWidth;
let cHeight;

const mPos = [0, 0];
let volume = 20;
let color;
let start = true;
const fire = (p, rr, directVelocity, color) => {
  const N = 32;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * 2 * Math.PI;
    const power = Math.min(Vector.length(directVelocity) * 0.5, 10);
    const volume = 5 + rr * Math.random() - power;
    //console.log(volume);
    const velocity = 2 + 2 * Math.random() + 150 / volume;
    const vv0 = [Math.cos(a), Math.sin(a)];

    particles.push(
      new Paint(
        Vector.add(p, Vector.scale(vv0, rr * 0.5)),
        Vector.add(Vector.scale(vv0, velocity), directVelocity),
        volume,
        3 + 7 * Math.random() + power * Math.random(),
        10 / volume,
        color
      )
    );
  }
};
window.addEventListener("mousemove", function (e) {
  mPos[0] = e.offsetX;
  mPos[1] = e.offsetY;
});
let prev_mPos = mPos.slice();
let mousedown = false;
window.addEventListener("mousedown", function (e) {
  mousedown = true;
  volume = 20;
  color = `hsla(${360 * Math.random()},100%,50%)`;
  start = false;
});
window.addEventListener("mouseup", function (e) {
  mousedown = false;
  const v = Vector.sub(mPos, prev_mPos);
  const a = Math.atan2(v[1], v[0]);
  const directVelocity = Vector.scale([Math.cos(a), Math.sin(a)], Math.min(Vector.length(v) * 0.5, 80));
  fire(mPos, volume, directVelocity, color);
});
window.addEventListener("resize", () => {
  init();
});
/*const N = 8 * 10;
let gN = 4 + Math.floor(Math.random() * 4);
let num = N;
let count = 0;
const items = [...new Array(gN)].map(() => 0);
while (num > 0) {
  let a = Math.floor(1 + Math.random() * (N / gN));
  items[count] += a < num ? a : num;
  num -= a;
  count++;
  count %= gN;
}
const itemD = [...new Array(gN)].map(() => 5 + 5 * Math.random());
const itemH = [...new Array(gN)].map(() => 40 + 20 * Math.random());
const rr = [];
items.forEach((el, index) => {
  for (let i = 0; i < el; i++) {
    let rate = i / el;
    let val = lagrangeInterpolation([0, 1, 0], rate);
    rr.push(itemH[index] * (1 - rate) + itemH[(index + 1) % itemH.length] * rate + itemD[index] * val);
  }
});
console.log(items);*/

//let time = 0;
function update() {
  prev_mPos = mPos.slice();
  //ctx01.clearRect(0, 0, cWidth, cHeight);
  //ctx01.fillStyle = "#000000";
  //ctx01.fillRect(0, 0, cWidth, cHeight);
  /*ctx01.fillStyle = "#00000001";
  ctx01.fillRect(0, 0, cWidth, cHeight);
  time++;
  if (time > 30) {
    time %= 30;
    ctx01.fillStyle = "#00000040";
    ctx01.fillRect(0, 0, cWidth, cHeight);
  }*/

  /*ctx01.save();
  ctx01.globalCompositeOperation = "destination-out";
  ctx01.fillStyle = "rgba(0,0,0,0.01)";
  ctx01.fillRect(0, 0, cWidth, cHeight);
  ctx01.restore();*/

  /*ctx01.lineJoin = "round";
  ctx01.lineCap = "round";*/

  particles.forEach((s, i, ary) => {
    s.update();
    //s.volume <= 0 && ary.splice(i, 1);
  });

  ctx01.save();
  particles.forEach((s) => s.render(ctx01));
  ctx01.restore();

  /*ctx01.save();
  ctx01.fillStyle = "#ff0000";
  //ctx01.strokeStyle = "#ff0000";
  ctx01.translate(100, 100);
  ctx01.beginPath();
  ctx01.moveTo(rr[0], 0);
  for (let i = 1; i < N; i++) {
    ctx01.rotate((2 * Math.PI) / N);
    //ctx01.translate(0, 2);
    ctx01.lineTo(rr[i], 0);
  }
  ctx01.closePath();
  ctx01.fill();
  //ctx01.stroke();
  ctx01.restore();*/

  ctx02.clearRect(0, 0, cWidth, cHeight);

  if (mousedown) {
    ctx02.save();
    setShadow(ctx02, 0, 0, 10, "rgba(0,0,0,0.5)");
    volume++;
    volume = Math.min(volume, 40);
    //ctx02.strokeStyle = "rgba(0,0,0,0.5)";
    ctx02.fillStyle = color;
    ctx02.beginPath();
    ctx02.arc(mPos[0], mPos[1], volume, 0, 2 * Math.PI, true);
    ctx02.fill();
    ctx02.restore();
    //ctx02.stroke();
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
}

const particles = [];

const init = () => {
  cWidth = canvas01.width = canvas02.width = window.innerWidth;
  cHeight = canvas01.height = canvas02.height = window.innerHeight;
  ctx01.fillStyle = "#000000";
  ctx01.fillRect(0, 0, cWidth, cHeight);
  update();
};

let oldTime = Date.now();
const animate = () => {
  requestAnimationFrame(animate);
  let nowTime = Date.now();
  let delta = (nowTime - oldTime) / 1000;
  oldTime = nowTime;

  update();

  ctx02.save();
  ctx02.font = "bold 18px Noto Sans TC";
  ctx02.textAlign = "start";
  ctx02.textBaseline = "hanging";
  ctx02.fillStyle = "#ff0000";
  ctx02.fillText((1 / delta).toFixed(1), 10, 10);
  ctx02.restore();
};
init();
animate();
