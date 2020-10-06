import { Vector } from "./vector";
import Paint from "./paint";
//import { setShadow, createCTX } from "./base";
class Bucket {
  constructor() {
    this.particles = [];
    this.minPos = [Infinity, Infinity];
    this.maxPos = [-Infinity, -Infinity];
    this.prevMinPos = [Infinity, Infinity];
    this.prevMaxPos = [-Infinity, -Infinity];
    /*this.ctx = ctx;
    this.myCTX = createCTX();
    this.myCTX.canvas.width = ctx.canvas.width;
    this.myCTX.canvas.height = ctx.canvas.height;*/
  }
  splash(p, rr, directVelocity, color) {
    const N = Math.floor(rr * 0.8);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * 2 * Math.PI + 0.1 * (1 - 2 * Math.random());
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
    this.prevMinPos = this.minPos.slice();
    this.prevMaxPos = this.maxPos.slice();
    this.particles.forEach((el, i, ary) => {
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
    });
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

    ctx.save();
    this.particles.forEach((el) => el.render(ctx));
    ctx.restore();
    /*if (this.particles.length) {
      const myCTX = this.myCTX;
      myCTX.save();
      this.particles.forEach((el) => el.render(myCTX));
      myCTX.restore();
    }

    this.ctx.save();
    //this._ctx.globalAlpha = 0.1;
    setShadow(this.ctx, 3, 3, 6, "rgba(0,0,0,0.15)");
    this.ctx.drawImage(this.myCTX.canvas, 0, 0);
    this.ctx.restore();*/

    /*this.ctx.save();
    const v = Vector.sub(this.prevMaxPos, this.prevMinPos);
    this.imageData = this.ctx.getImageData(0, 0, v[0], v[1]);
    this.ctx.clearRect(0, 0, ...v);

    const v0 = Vector.sub(this.maxPos, this.minPos);
    this.ctx.canvas.width = v0[0];
    this.ctx.canvas.height = v0[1];

    const m = Vector.sub(this.prevMinPos, this.minPos);
    this.ctx.putImageData(this.imageData, m[0], m[1]);

    this.ctx.translate(-this.minPos[0], -this.minPos[1]);
    this.particles.forEach((el) => el.render(this.ctx));
    this.ctx.restore();

    ctx.save();
    ctx.drawImage(this.ctx.canvas, this.minPos[0], this.minPos[1]);
    ctx.restore();*/
  }
}
export default Bucket;
