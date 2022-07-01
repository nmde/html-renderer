import { add, len, sub } from 'gl-vec3';

/**
 * Wrapper class around gl-vec3.
 */
export default class Vector {
  public value: number[] = [];

  /**
   * Constructs vector.
   *
   * @param value - The vector values.
   */
  public constructor(value: number[]) {
    this.value = value;
  }

  /**
   * Adds a vector to this vector.
   * 
   * @param v - The Vector to add.
   * @returns The result of the vector addition.
   */
  public add(v: Vector): Vector {
    const temp = this.clone().value;
    add(temp, temp, v.value);
    return new Vector(temp);
  }

  /**
   * Creates a clone of this vector.
   * 
   * @returns The clone vector.
   */
  public clone(): Vector {
    return new Vector([...this.value]);
  }

  /**
   * Gets the norm of the vector.
   *
   * @returns The vector norm (length).
   */
  public get norm(): number {
    return len(this.value);
  }

  /**
   * Subtracts the given vector from this vector.
   *
   * @param v - The vector to subtract.
   * @returns The result of the vector substraction.
   */
  public subtract(v: Vector): Vector {
    const temp = this.clone().value;
    sub(temp, temp, v.value);
    return new Vector(temp);
  }

  /**
   * The X coordinate.
   *
   * @returns The X coordinate.
   */
  public get x(): number {
    return this.value[0];
  }

  /**
   * The Y coordinate.
   *
   * @returns The Y coordinate.
   */
  public get y(): number {
    return this.value[1];
  }

  /**
   * The Z coordinate.
   *
   * @returns The Z coordinate.
   */
  public get z(): number {
    return this.value[2];
  }
}
