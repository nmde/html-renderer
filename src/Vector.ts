import { add, len } from 'gl-vec3';

/**
 * Wrapper class around gl-vec3.
 */
export default class Vector {
  public values: number[] = [];

  /**
   * Constructs vector.
   *
   * @param values - The vector values.
   */
  public constructor(values: number[]) {
    this.values = values;
  }

  /**
   * Adds a vector to this vector.
   * 
   * @param v - The Vector to add.
   * @returns The result of the vector addition.
   */
  public add(v: Vector): Vector {
    const temp = this.clone().values;
    add(temp, temp, v.values);
    return new Vector(temp);
  }

  /**
   * Creates a clone of this vector.
   * 
   * @returns The clone vector.
   */
  public clone(): Vector {
    return new Vector([...this.values]);
  }

  /**
   * Gets the norm of the vector.
   *
   * @returns The vector norm (length).
   */
  public get norm(): number {
    return len(this.values);
  }

  /**
   * The X coordinate.
   *
   * @returns The X coordinate.
   */
  public get x(): number {
    return this.values[0];
  }

  /**
   * The Y coordinate.
   *
   * @returns The Y coordinate.
   */
  public get y(): number {
    return this.values[1];
  }

  /**
   * The Z coordinate.
   *
   * @returns The Z coordinate.
   */
  public get z(): number {
    return this.values[2];
  }
}
