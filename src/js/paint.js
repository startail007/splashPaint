import { Vector } from "./vector.js";
import { Point } from "./point.js";
import { circleToCircleTangentPoint } from "./circle.js";
class Paint {
  constructor(pos = [0, 0], velocity = [0, 0], volume = 5, z = 0, zVelocity = 5, color = "hsl(0,100%,50%)") {
    this.options = {
      pos,
      velocity,
      volume,
      z,
      zVelocity,
      color,
    };
    this.init();
  }
  init() {
    this.maxVolume = this.options.volume;
    this.volume = this.maxVolume;
    this.prevPos = this.options.pos.slice();
    this.pos = this.options.pos.slice();
    this.velocity = this.options.velocity.slice();
    this.z = this.options.z;
    this.zVelocity = this.options.zVelocity;
    this.swing = Math.random();
    this.data = [];
  }
  update() {
    this.prevVolume = this.volume;
    this.prevZ = this.z;
    this.prevPos[0] = this.pos[0];
    this.prevPos[1] = this.pos[1];
    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];

    const swing = Vector.rotate(
      [Math.sin(this.swing * 2 * Math.PI), 0],
      Math.atan2(this.velocity[0], -this.velocity[1])
    );
    const rate = 1 - this.volume / this.maxVolume;
    this.velocity[0] += rate * swing[0];
    this.velocity[1] += rate * swing[1];
    //this.velocity[1] += 0.981;

    this.z += this.zVelocity;
    this.zVelocity -= 0.981;
    this.zVelocity *= 0.94;
    if (this.z < 0) {
      this.zVelocity *= -1;
      this.zVelocity *= 0.8;
      this.z = 0;
    }

    if (this.z < this.volume) {
      this.velocity[0] *= 0.8;
      this.velocity[1] *= 0.8;
      this.swing += 0.1;
      this.swing %= 1;
      if (this.volume > 0) {
        this.volume -= 1.5 + 0.2 * Math.random();
      }
    } else {
      this.velocity[0] *= 0.94;
      this.velocity[1] *= 0.94;
    }
  }
  render(ctx) {
    if (this.volume <= 0) return;
    if (this.z < this.volume) {
      let r = this.volume - this.z;
      r = r > 1 ? r : 1;

      let prevR = this.prevVolume - this.prevZ;
      prevR = prevR > 1 ? prevR : 1;

      ctx.fillStyle = this.options.color;
      const points = circleToCircleTangentPoint(this.prevPos, prevR, this.pos, r);
      if (points) {
        ctx.beginPath();
        ctx.moveTo(points[0].p0[0], points[0].p0[1]);
        ctx.lineTo(points[0].p1[0], points[0].p1[1]);
        ctx.lineTo(points[1].p1[0], points[1].p1[1]);
        ctx.lineTo(points[1].p0[0], points[1].p0[1]);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.prevPos[0], this.prevPos[1], prevR, 0, 2 * Math.PI, true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], r, 0, 2 * Math.PI, true);
        ctx.fill();
      } else {
        if (prevR > r) {
          ctx.beginPath();
          ctx.arc(this.prevPos[0], this.prevPos[1], prevR, 0, 2 * Math.PI, true);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(this.pos[0], this.pos[1], r, 0, 2 * Math.PI, true);
          ctx.fill();
        }
      }
    }
  }
}
export { Paint };
