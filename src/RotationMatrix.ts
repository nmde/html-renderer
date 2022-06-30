import { matrix } from 'mathjs';
import Vector from './Vector';

/**
 * Class for generating rotation matrices.
 *
 * Originally implemented by Glenn Murray.
 * Adapted from https://github.com/orestesgaolin/matrix_rotate_arbitrary_axis.
 */
export default class RotationMatrix {
  public static TOLERANCE = 1e-9;

  /**
   * Compute the rotated point from the formula given in the paper.
   *
   * @param line - The line of rotation.
   * @param direction - The line's direction vector.
   * @param point - The point.
   * @param theta - The angle of rotation, in radians.
   * @returns The rotated point.
   */
  public static rotPointFromFormula(
    line: Vector,
    direction: Vector,
    point: Vector,
    theta: number,
  ) {
    const a = line.x;
    const b = line.y;
    const c = line.z;
    let u = direction.x;
    let v = direction.y;
    let w = direction.z;
    const { x, y, z } = point;
    // We normalize the direction vector.

    const l = this.longEnough(direction);
    if (l < 0) {
      throw new Error('RotationMatrix direction vector too short');
    }
    // Normalize the direction vector.
    u /= l; // Note that is not "this.u".
    v /= l;
    w /= l;
    // Set some intermediate values.
    const u2 = u * u;
    const v2 = v * v;
    const w2 = w * w;
    const cosT = Math.cos(theta);
    const oneMinusCosT = 1 - cosT;
    const sinT = Math.sin(theta);

    // Use the formula in the paper.
    const p = new Vector([
      (a * (v2 + w2) - u * (b * v + c * w - u * x - v * y - w * z))
        * oneMinusCosT
        + x * cosT
        + (-c * v + b * w - w * y + v * z) * sinT,
      (b * (u2 + w2) - v * (a * u + c * w - u * x - v * y - w * z))
        * oneMinusCosT
        + y * cosT
        + (c * u - a * w + w * x - u * z) * sinT,
      (c * (u2 + v2) - w * (a * u + b * v - u * x - v * y - w * z))
        * oneMinusCosT
        + z * cosT
        + (-b * u + a * v - v * x + u * y) * sinT,
    ]);
    return p;
  }

  /**
   * Check whether a vector's length is less than [TOLERANCE].
   *
   * @param vector - The vector to check.
   * @returns The length if it is greater than [TOLERANCE], or -1 if not.
   */
  public static longEnough(vector: Vector) {
    const l = Math.sqrt(
      vector.x * vector.x + vector.y * vector.y + vector.z * vector.z,
    );
    if (l > RotationMatrix.TOLERANCE) {
      return l;
    }
    return -1;
  }

  private m11: number;

  private m12: number;

  private m13: number;

  private m14: number;

  private m21: number;

  private m22: number;

  private m23: number;

  private m24: number;

  private m31: number;

  private m32: number;

  private m33: number;

  private m34: number;

  /**
   * Build a rotation matrix for rotations about the line through (a, b, c)
   * parallel to [u, v, w] by the angle theta.
   *
   * @param line - Line to rotate about.
   * @param direction - Direction vector.
   * @param theta - The angle of rotation, in radians.
   */
  public constructor(line: Vector, direction: Vector, theta: number) {
    const a = line.x;
    const b = line.y;
    const c = line.z;
    const uUn = direction.x;
    const vUn = direction.y;
    const wUn = direction.z;
    const l = RotationMatrix.longEnough(new Vector([uUn, vUn, wUn]));
    if (l < 0) {
      throw new Error('RotationMatrix: direction vector too short!');
    }

    // In this instance we normalize the direction vector.
    const u = uUn / l;
    const v = vUn / l;
    const w = wUn / l;

    // Set some intermediate values.
    const u2 = u * u;
    const v2 = v * v;
    const w2 = w * w;
    const cosT = Math.cos(theta);
    const oneMinusCosT = 1 - cosT;
    const sinT = Math.sin(theta);

    // Build the matrix entries element by element.
    this.m11 = u2 + (v2 + w2) * cosT;
    this.m12 = u * v * oneMinusCosT - w * sinT;
    this.m13 = u * w * oneMinusCosT + v * sinT;
    this.m14 = (a * (v2 + w2) - u * (b * v + c * w)) * oneMinusCosT
      + (b * w - c * v) * sinT;

    this.m21 = u * v * oneMinusCosT + w * sinT;
    this.m22 = v2 + (u2 + w2) * cosT;
    this.m23 = v * w * oneMinusCosT - u * sinT;
    this.m24 = (b * (u2 + w2) - v * (a * u + c * w)) * oneMinusCosT
      + (c * u - a * w) * sinT;

    this.m31 = u * w * oneMinusCosT - v * sinT;
    this.m32 = v * w * oneMinusCosT + u * sinT;
    this.m33 = w2 + (u2 + v2) * cosT;
    this.m34 = (c * (u2 + v2) - w * (a * u + b * v)) * oneMinusCosT
      + (a * v - b * u) * sinT;
  }

  /**
   * Gets the resulting matrix.
   *
   * @returns The matrix.
   */
  public get matrix() {
    return matrix([
      [this.m11, this.m21, this.m31, 0],
      [this.m12, this.m22, this.m32, 0],
      [this.m13, this.m23, this.m33, 0],
      [this.m14, this.m24, this.m34, 1],
    ]);
  }

  /**
   * Multiply this [RotationMatrix] times the point (x, y, z, 1),
   * representing a point P(x, y, z) in homogeneous coordinates.
   *
   * @param point - The point.
   * @returns The product representing the point.
   */
  public timesXYZ(point: Vector) {
    const { x, y, z } = point;
    return new Vector([
      this.m11 * x + this.m12 * y + this.m13 * z + this.m14,
      this.m21 * x + this.m22 * y + this.m23 * z + this.m24,
      this.m31 * x + this.m32 * y + this.m33 * z + this.m34,
    ]);
  }
}
