import { Vector, VectorE } from "./vector.js";
import { Point } from "./point.js";
//圓與線的交點
const circleToLineIntersection = (p, r, a, b, c) => {
  const aa = a * a + b * b;
  if (b != 0) {
    const bb0 = 2 * a * c + b * 2 * p[1] * a - b * b * 2 * p[0];
    const cc0 = c * c + b * 2 * p[1] * c + b * b * p[1] * p[1] + b * b * p[0] * p[0] - b * b * r * r;
    const m = (b > 0 ? -1 : 1) * Math.sqrt(bb0 * bb0 - 4 * aa * cc0);
    const xx0 = (-bb0 - m) / (2 * aa);
    const xx1 = (-bb0 + m) / (2 * aa);
    const yy0 = -(a * xx0 + c) / b;
    const yy1 = -(a * xx1 + c) / b;
    return { p0: [xx0, yy0], p1: [xx1, yy1] };
  } else if (a != 0) {
    const bb1 = 2 * b * c + a * 2 * p[0] * b - a * a * 2 * p[1];
    const cc1 = c * c + a * 2 * p[0] * c + a * a * p[0] * p[0] + a * a * p[1] * p[1] - a * a * r * r;
    const m = (a > 0 ? 1 : -1) * Math.sqrt(bb1 * bb1 - 4 * aa * cc1);
    const yy0 = (-bb1 - m) / (2 * aa);
    const yy1 = (-bb1 + m) / (2 * aa);
    const xx0 = -(b * yy0 + c) / a;
    const xx1 = -(b * yy1 + c) / a;
    return { p0: [xx0, yy0], p1: [xx1, yy1] };
  }
};
//圓與圓的交點連成直線方程式
const circleToCircleIntersectionLine = (p0, r0, p1, r1) => {
  const a = -2 * p0[0] + 2 * p1[0];
  const b = -2 * p0[1] + 2 * p1[1];
  const c = p0[0] * p0[0] + p0[1] * p0[1] - r0 * r0 - p1[0] * p1[0] - p1[1] * p1[1] + r1 * r1;
  return { a, b, c };
};
//圓與圓的交點
const circleToCircleIntersection = (p0, r0, p1, r1) => {
  const line = circleToCircleIntersectionLine(p0, r0, p1, r1);
  return circleToLineIntersection(p0, r0, line.a, line.b, line.c);
};
//圓與圓的公切線交點
const circleToCircleTangentIntersection = (p0, r0, p1, r1, out = true) => {
  if (out) {
    const x = (p0[0] * r1 - p1[0] * r0) / (r1 - r0);
    const y = (p0[1] * r1 - p1[1] * r0) / (r1 - r0);
    return [x, y];
  } else {
    const x = (p0[0] * r1 + p1[0] * r0) / (r1 + r0);
    const y = (p0[1] * r1 + p1[1] * r0) / (r1 + r0);
    return [x, y];
  }
};
//圓與點的切線點
const circleToPointTangentPoint = (p0, r0, p1) => {
  const r = Point.distance(p0, p1);
  if (r < r0) {
    return;
  }
  const r1 = Math.sqrt(r * r - r0 * r0);
  return circleToCircleIntersection(p0, r0, p1, r1);
};
//圓與圓的公切線點
const circleToCircleTangentPoint = (p0, r0, p1, r1) => {
  const r = Point.distance(p0, p1);
  if (r < Math.abs(r1 - r0)) {
    return;
  }
  const v = Vector.sub(p1, p0);
  const a0 = Math.atan2(v[1], v[0]);
  const a1 = Math.acos((r0 - r1) / r);

  const v0 = [Math.cos(a0 - a1), Math.sin(a0 - a1)];
  const pp0_0 = Vector.add(p0, Vector.scale(v0, r0));
  const pp0_1 = Vector.add(p1, Vector.scale(v0, r1));

  const v1 = [Math.cos(a0 + a1), Math.sin(a0 + a1)];
  const pp1_0 = Vector.add(p0, Vector.scale(v1, r0));
  const pp1_1 = Vector.add(p1, Vector.scale(v1, r1));

  return [
    { p0: pp0_0, p1: pp0_1 },
    { p0: pp1_0, p1: pp1_1 },
  ];
};
export {
  circleToCircleTangentIntersection,
  circleToLineIntersection,
  circleToCircleIntersectionLine,
  circleToCircleIntersection,
  circleToPointTangentPoint,
  circleToCircleTangentPoint,
};
