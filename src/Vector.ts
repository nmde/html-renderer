import { Coordinate } from './types';

/**
 * Represents a vector.
 */
export default class Vector {
  /**
   * Converts arrays of numbers into Vector objects.
   *
   * @param coords - Coordinates to create.
   * @returns The corresponding vectors.
   */
  public static from(...coords: Coordinate[]) {
    return coords.map((coord) => new Vector(coord[0], coord[1], coord[2]));
  }

  /**
   * X coordinate.
   */
  public x: number;

  /**
   * Y coordinate.
   */
  public y: number;

  /**
   * Z coordinate.
   */
  public z: number;

  /**
   * Constructs Vector.
   *
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   * @param z - The z coordinate.
   */
  public constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * The magnitude of the vector.
   *
   * @returns The magnitude of the vector.
   */
  public get mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  /**
   * Adds another vector to this vector.
   *
   * @param v - The vector to add.
   * @returns The result of the addition.
   */
  public add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }
}
