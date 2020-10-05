import { Vector } from "./vector";
import Paint from "./paint";
class Bucket {
  constructor() {
    this.particles = [];
    this.minPos = [Infinity, Infinity];
    this.maxPos = [-Infinity, -Infinity];
  }
  splash(p, rr, directVelocity, color) {
    const N = 32;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * 2 * Math.PI;
      const power = Math.min(Vector.length(directVelocity) * 0.5, 10);
      const volume = 5 + rr * Math.random() - power;
      //console.log(volume);
      const velocity = 5 + Math.min(Math.max(2 * Math.random() + 100 / volume, 0), 35);
      const vv0 = [Math.cos(a), Math.sin(a)];

      this.particles.push(
        new Paint(
          Vector.add(p, Vector.scale(vv0, rr * 0.25)),
          Vector.add(Vector.scale(vv0, velocity), directVelocity),
          volume,
          3 + 7 * Math.random() + power * Math.random(),
          10 / volume,
          color
        )
      );
    }
    this.calcRect();
  }
  calcRect() {
    /*this.particles.forEach((el, i, ary) => {
      const r = el.getR();
      const pos = el.pos;
      if (pos[0] - r < this.minPos[0]) {
        this.minPos[0] = pos[0] - r;
      }
      if (pos[1] - r < this.minPos[1]) {
        this.minPos[1] = pos[1] - r;
      }
      if (pos[0] + r > this.maxPos[0]) {
        this.maxPos[0] = pos[0] + r;
      }
      if (pos[1] + r > this.maxPos[1]) {
        this.maxPos[1] = pos[1] + r;
      }
    });*/
  }
  update() {
    this.particles.forEach((el, i, ary) => {
      el.update();
      el.volume <= 0 && ary.splice(i, 1);
    });
    this.calcRect();

    //this.minPos
    //console.log(this.minPos, this.maxPos);
  }
  render(ctx) {
    if (!this.particles.length) {
      /*const v = Vector.sub(this.maxPos, this.minPos);
      ctx.save();
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.rect(this.minPos[0], this.minPos[1], v[0], v[1]);
      ctx.stroke();
      ctx.restore();*/

      return;
    }
    /*ctx.save();
    this.particles.forEach((el) => {
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(el.pos[0], el.pos[1], 2, 0, 2 * Math.PI);
      ctx.stroke();
    });
    ctx.restore();*/
    ctx.save();
    this.particles.forEach((el) => el.render(ctx));
    ctx.restore();
  }
}
export default Bucket;
