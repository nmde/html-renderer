type VectorLike = Vector | number[];

/**
 * Utility for compatibility between Vectors and arrays of numbers as arguments.
 *
 * @param vector - The Vector or array of numbers.
 * @returns The elements of the vector.
 */
function getElements(vector: VectorLike) {
  let V: number[];
  if ((vector as Vector).elements) {
    V = (vector as Vector).elements;
  } else {
    V = vector as number[];
  }
  return V;
}

/**
 * Vector class.
 */
export default class Vector {
  /**
   * Creates a vector with n copies of v.
   *
   * @param n - The size of the vector.
   * @param v - The value to fill with.
   * @returns - The new vector.
   */
  public static Fill(n: number, v: number) {
    const elements: number[] = [];
    let x = n;
    while (x > 0) {
      elements.push(v);
      x -= 1;
    }
    return new Vector(elements);
  }

  /**
   * Vector filled with zeros.
   *
   * @param n - The size of the vector.
   * @returns - The vector.
   */
  public static Zero(n: number) {
    return Vector.Fill(n, 0);
  }

  public elements: number[] = [];

  /**
   * Constructs Vector.
   *
   * @param elements - Elements of the vector.
   */
  public constructor(elements: number[]) {
    this.elements = elements;
  }

  /**
   * Returns the result of adding the argument to the vector.
   *
   * @param value - The value to add.
   * @returns - The result of addition.
   */
  public add(value: VectorLike | number) {
    if (typeof value === 'number') {
      return this.map((v) => v + value);
    }
    const V = getElements(value);
    return this.map((x, i) => x + V[i - 1]);
  }

  /**
   * Calls the iterator for each element of the vector in turn.
   *
   * @param fn - The function to apply.
   */
  public each(fn: (el: number, index: number) => void) {
    const n = this.elements.length;
    for (let i = 0; i < n; i += 1) {
      fn(this.elements[i], i + 1);
    }
  }

  /**
   * Maps the vector to another vector according to the given function.
   *
   * @param fn - The mapping function.
   * @returns The mapped vector.
   */
  public map(fn: (el: number, index: number) => number) {
    const elements: number[] = [];
    this.each((x, i) => {
      elements.push(fn(x, i));
    });
    return new Vector(elements);
  }

  /**
   * The length of the vector.
   *
   * @returns The length of the vector.
   */
  public get norm() {
    let n = this.elements.length;
    let sum = 0;
    while (n > 0) {
      sum += this.elements[n] ** 2;
      n -= 1;
    }
    return Math.sqrt(sum);
  }

  /**
   * The x coordinate.
   *
   * @returns - The x coordinate.
   */
  public get x() {
    return this.elements[0];
  }

  /**
   * The y coordinate.
   *
   * @returns - The y coordinate.
   */
  public get y() {
    return this.elements[1];
  }

  /**
   * The z coordinate.
   *
   * @returns - The z coordinate.
   */
  public get z() {
    return this.elements[2];
  }
}
