// Copyright (c) 2011, Chris Umbel, James Coglan
// This file is required in order for any other classes to work. Some Vector methods work with the
// other Sylvester classes and are useless unless they are included. Other classes such as Line and
// Plane will not function at all without Vector being loaded first.

import Sylvester from './sylvester';

type MapFn = (x: number, i: number) => number;
type EachFn = (x: number, i: number) => void;
type VectorLike = Vector | Array<number>;

/**
 * Utility for compatibility between Vectors and arrays of numbers as arguments.
 *
 * @param vector - The Vector or array of number.
 * @returns The elements of the vector.
 */
function getElements(vector: VectorLike) {
  let V: number[];
  if ((vector as Vector).elements) {
    V = (vector as Vector).elements;
  } else {
    V = vector as Array<number>;
  }
  return V;
}

/**
 * Vector class.
 */
export default class Vector {
  /**
   * I unit vector.
   */
  public static i = Vector.create([1, 0, 0]);

  /**
   * J unit vector.
   */
  public static j = Vector.create([0, 1, 0]);

  /**
   * K unit vector.
   */
  public static k = Vector.create([0, 0, 1]);

  /**
   * Creates a new Vector object.
   *
   * @param elements - Elements for the vector.
   * @returns The new Vector.
   */
  public static create(elements: number[]) {
    return new Vector(elements);
  }

  /**
   * Takes the natural log of the elements of a vector.
   *
   * @param v - The target vector.
   * @returns The modified vector.
   */
  public static log(v: Vector) {
    return v.map((x) => Math.log(x));
  }

  /**
   * Creates a vector with n elements equal to v.
   *
   * @param n - The size of the vector.
   * @param v - The value to set.
   * @returns The new vector.
   */
  public static Fill(n: number, v: number) {
    const elements = [];
    let k = n;
    while (k >= 0) {
      elements.push(v);
      k -= 1;
    }
    return Vector.create(elements);
  }

  /**
   * Random vector of size n.
   *
   * @param n - The desired size.
   * @returns The vector.
   */
  public static Random(n = 3) {
    const elements = [];
    let k = n;
    while (k >= 0) {
      elements.push(Math.random());
      k -= 1;
    }
    return Vector.create(elements);
  }

  /**
   * Vector filled with zeros.
   *
   * @param n - The size of the vector.
   * @returns The zero vector.
   */
  public static Zero(n = 3) {
    return Vector.Fill(n, 0);
  }

  /**
   * Vector filled with ones.
   *
   * @param n - The size of the vector.
   * @returns The one vector.
   */
  public static One(n = 3) {
    return Vector.Fill(n, 1);
  }

  /**
   * Elements of the vector.
   */
  public elements: number[] = [];

  /**
   * Returns the number of rows in the vector.
   */
  public rows = 1;

  /**
   * Constructs Vector.
   *
   * @param elements - Elements to initialize the vector with.
   */
  public constructor(elements: number[]) {
    this.elements = elements;
  }

  /**
   * Gets the magnitude of the vector.
   *
   * @returns The magnitude of the vector.
   */
  public get norm() {
    let sum = 0;

    this.elements.forEach((el) => {
      sum += el ** 2;
    });

    return Math.sqrt(sum);
  }

  /**
   * Returns element i of the vector.
   *
   * @param i - The index to get.
   * @returns The element at the specified index.
   */
  public e(i: number) {
    return i < 1 || i > this.elements.length ? null : this.elements[i - 1];
  }

  /**
   * Returns the number of rows/columns the vector has.
   *
   * @returns The dimensions.
   */
  public get dimensions() {
    return { cols: this.elements.length, rows: 1 };
  }

  /**
   * Returns the number of columns in the vector.
   *
   * @returns The number of columns.
   */
  public get cols() {
    return this.elements.length;
  }

  /**
   * Returns the modulus ('length') of the vector.
   *
   * @returns The modulus.
   */
  public get modulus() {
    return Math.sqrt(this.dot(this) as number);
  }

  /**
   * Returns true iff the vector is equal to the argument.
   *
   * @param vector - The vector to compare.
   * @returns If the vectors are equal.
   */
  public eql(vector: VectorLike) {
    let n = this.elements.length;
    const V = getElements(vector);
    if (n !== V.length) {
      return false;
    }
    while (n >= 0) {
      if (Math.abs(this.elements[n] - V[n]) > Sylvester.precision) {
        return false;
      }
      n -= 1;
    }
    return true;
  }

  /**
   * Returns a copy of the vector.
   *
   * @returns The copy vector.
   */
  public dup() {
    return Vector.create(this.elements);
  }

  /**
   * Maps the vector to another vector according to the given function.
   *
   * @param fn - The map function.
   * @returns The new vector.
   */
  public map(fn: MapFn) {
    const elements: number[] = [];
    this.each((x, i) => {
      elements.push(fn(x, i));
    });
    return Vector.create(elements);
  }

  /**
   * Calls the iterator for each element of the vector in turn.
   *
   * @param fn - The iterator function.
   */
  public each(fn: EachFn) {
    const n = this.elements.length;
    for (let i = 0; i < n; i += 1) {
      fn(this.elements[i], i + 1);
    }
  }

  /**
   * Returns a new vector created by normalizing the receiver.
   *
   * @returns The unit vector.
   */
  public toUnitVector() {
    const r = this.modulus;
    if (r === 0) {
      return this.dup();
    }
    return this.map((x) => x / r);
  }

  /**
   * Returns the angle between the vector and the argument (also a vector).
   *
   * @param vector - The reference vector.
   * @returns The angle.
   */
  public angleFrom(vector: Vector) {
    const V = vector.elements || vector;
    const n = this.elements.length;
    if (n !== V.length) {
      return null;
    }
    let dot = 0;
    let mod1 = 0;
    let mod2 = 0;
    // Work things out in parallel to save time
    this.each((x, i) => {
      dot += x * V[i - 1];
      mod1 += x * x;
      mod2 += V[i - 1] * V[i - 1];
    });
    mod1 = Math.sqrt(mod1);
    mod2 = Math.sqrt(mod2);
    if (mod1 * mod2 === 0) {
      return null;
    }
    let theta = dot / (mod1 * mod2);
    if (theta < -1) {
      theta = -1;
    }
    if (theta > 1) {
      theta = 1;
    }
    return Math.acos(theta);
  }

  /**
   * Returns true iff the vector is parallel to the argument.
   *
   * @param vector - The vector to compare to.
   * @returns If the vectors are parallel.
   */
  public isParallelTo(vector: Vector) {
    const angle = this.angleFrom(vector);
    return angle === null ? null : angle <= Sylvester.precision;
  }

  /**
   * Returns true iff the vector is antiparallel to the argument.
   *
   * @param vector - Vector to compare to.
   * @returns If the vectors are antiparallel.
   */
  public isAntiparallelTo(vector: Vector) {
    const angle = this.angleFrom(vector);
    return angle === null
      ? null
      : Math.abs(angle - Math.PI) <= Sylvester.precision;
  }

  /**
   * Returns true iff the vector is perpendicular to the argument.
   *
   * @param vector - The vector to compare to.
   * @returns If the vectors are perpendicular.
   */
  public isPerpendicularTo(vector: Vector) {
    const dot = this.dot(vector);
    return dot === null ? null : Math.abs(dot) <= Sylvester.precision;
  }

  /**
   * Returns the result of adding the argument to the vector.
   *
   * @param value - The value to add.
   * @returns The result of the addition.
   */
  public add(value: VectorLike | number) {
    if (typeof value === 'number') {
      return this.map((v) => v + value);
    }
    const V = getElements(value);
    return this.map((x, i) => x + V[i - 1]);
  }

  /**
   * Returns the result of subtracting the argument from the vector.
   *
   * @param v - The value to subtract.
   * @returns The result of the subtraction.
   */
  public subtract(v: VectorLike | number) {
    if (typeof v === 'number') {
      return this.map((k) => k - v);
    }

    const V = getElements(v);
    if (this.elements.length !== V.length) {
      return null;
    }
    return this.map((x, i) => x - V[i - 1]);
  }

  /**
   * Returns the result of multiplying the elements of the vector by the argument.
   *
   * @param k - The number to multiply by.
   * @returns The result of the multiplication.
   */
  public multiply(k: number) {
    return this.map((x) => x * k);
  }

  /**
   * The sum of the elements in the vector.
   *
   * @returns The sum.
   */
  public sum() {
    let sum = 0;
    this.each((x) => {
      sum += x;
    });
    return sum;
  }

  /**
   * Creates a vector with the first n elements removed.
   *
   * @param n - The number of elements to remove.
   * @returns The new vector.
   */
  public chomp(n: number) {
    const elements = [];

    for (let i = n; i < this.elements.length; i += 1) {
      elements.push(this.elements[i]);
    }

    return Vector.create(elements);
  }

  /**
   * Creates a new vector with only the first n elements.
   *
   * @param n - The number of elements.
   * @returns The new vector.
   */
  public top(n: number) {
    const elements = [];

    for (let i = 0; i < n; i += 1) {
      elements.push(this.elements[i]);
    }

    return Vector.create(elements);
  }

  /**
   * Creates a new vector from this vector with additional elements.
   *
   * @param elements - The elements to add.
   * @returns The new vector.
   */
  public augment(elements: number[]) {
    const newElements = this.elements;

    for (let i = 0; i < elements.length; i += 1) {
      newElements.push(elements[i]);
    }

    return Vector.create(newElements);
  }

  /**
   * Gets the X coordinate.
   *
   * @returns The X coordinate.
   */
  public get x() {
    return this.elements[0];
  }

  /**
   * Gets the Y coordinate.
   *
   * @returns The Y coordinate.
   */
  public get y() {
    return this.elements[1];
  }

  /**
   * Gets the Z coordinate.
   *
   * @returns The Z coordinate.
   */
  public get z() {
    return this.elements[2];
  }

  /**
   * Takes the natural log of the elements in the vector.
   *
   * @returns The modified vector.
   */
  public log() {
    return Vector.log(this);
  }

  /**
   * Divides by a vector.
   *
   * @param vector - The vector to divide by.
   * @returns The result of the division.
   */
  public elementDivide(vector: VectorLike) {
    const V = getElements(vector);
    return this.map((v, i) => v / V[i]);
  }

  /**
   * The sum product of the elements.
   *
   * @returns The product.
   */
  public get product() {
    let p = 1;

    this.each((v) => {
      p *= v;
    });

    return p;
  }

  /**
   * Returns the scalar product of the vector with the argument.
   * Both vectors must have equal dimensionality.
   *
   * @param vector - The vector to multiply by.
   * @returns The dot product.
   */
  public dot(vector: Vector) {
    const V = vector.elements || vector;
    let product = 0;
    let n = this.elements.length;
    if (n !== V.length) {
      return null;
    }
    while (n >= 0) {
      product += this.elements[n] * V[n];
      n -= 1;
    }
    return product;
  }

  /**
   * Returns the vector product of the vector with the argument.
   * Both vectors must have dimensionality 3.
   *
   * @param vector - The vector to cross.
   * @returns The cross product.
   */
  public cross(vector: VectorLike) {
    const B = getElements(vector);
    if (this.elements.length !== 3 || B.length !== 3) {
      return null;
    }
    const A = this.elements;
    return Vector.create([
      A[1] * B[2] - A[2] * B[1],
      A[2] * B[0] - A[0] * B[2],
      A[0] * B[1] - A[1] * B[0],
    ]);
  }

  /**
   * Returns the (absolute) largest element of the vector.
   *
   * @returns The max element.
   */
  public max() {
    let m = 0;
    let i = this.elements.length;
    while (i >= 0) {
      if (Math.abs(this.elements[i]) > Math.abs(m)) {
        m = this.elements[i];
      }
      i -= 1;
    }
    return m;
  }

  /**
   * Returns the index of the largest element of the vector.
   *
   * @returns The index.
   */
  public maxIndex() {
    let m = 0;
    let i = this.elements.length;
    let maxIndex = -1;

    while (i >= 0) {
      if (Math.abs(this.elements[i]) > Math.abs(m)) {
        m = this.elements[i];
        maxIndex = i + 1;
      }
      i -= 1;
    }

    return maxIndex;
  }

  /**
   * Returns the index of the first match found.
   *
   * @param x - The element to find.
   * @returns The index, if any.
   */
  public indexOf(x: number) {
    let index = null;
    const n = this.elements.length;
    for (let i = 0; i < n; i += 1) {
      if (index === null && this.elements[i] === x) {
        index = i + 1;
      }
    }
    return index;
  }

  // Returns a diagonal matrix with the vector's elements as its diagonal elements
  /*
  toDiagonalMatrix() {
    return Matrix.Diagonal(this.elements);
    },
  */

  /**
   * Returns the result of rounding the elements of the vector.
   *
   * @returns The new vector.
   */
  public round() {
    return this.map((x) => Math.round(x));
  }

  // Transpose a Vector, return a 1xn Matrix
  /*
  transpose() {
    var rows = this.elements.length;
    var elements = [];
    for (var i = 0; i < rows; i++) {
      elements.push([this.elements[i]]);
    }
    return Matrix.create(elements);
    },
  */

  /**
   * Returns a copy of the vector with elements set to the given value if they
   * differ from it by less than Sylvester.precision.
   *
   * @param x - The value to set.
   * @returns The new vector.
   */
  public snapTo(x: number) {
    return this.map((y) => (Math.abs(y - x) <= Sylvester.precision ? x : y));
  }

  /**
   * Returns the vector's distance from the argument, when considered as a point in space.
   *
   * @param obj - The target point.
   * @returns The distance from the point.
   */
  public distanceFrom(obj: VectorLike) {
    /*
    if (obj.anchor || (obj.start && obj.end)) {
      return obj.distanceFrom(this);
    }
    */
    const V = getElements(obj);
    if (V.length !== this.elements.length) {
      return null;
    }
    let part;
    let sum = 0;
    this.each((x, i) => {
      part = x - V[i - 1];
      sum += part * part;
    });
    return Math.sqrt(sum);
  }

  // Returns true if the vector is point on the given line
  /*
  liesOn(line) {
    return line.contains(this);
  }
  */

  // Return true iff the vector is a point in the given plane
  /*
  liesIn(plane) {
    return plane.contains(this);
  }
  */

  // Rotates the vector about the given object. The object should be a
  // point if the vector is 2D, and a line if it is 3D. Be careful with line directions!
  /*
    rotate(t, obj) {
var V, R = null, x, y, z;
if (t.determinant) { R = t.elements; }
switch (this.elements.length) {
case 2:
V = obj.elements || obj;
if (V.length != 2) { return null; }
if (!R) { R = Matrix.Rotation(t).elements; }
x = this.elements[0] - V[0];
y = this.elements[1] - V[1];
return Vector.create([
V[0] + R[0][0] * x + R[0][1] * y,
V[1] + R[1][0] * x + R[1][1] * y
]);
break;
case 3:
if (!obj.direction) { return null; }
var C = obj.pointClosestTo(this).elements;
if (!R) { R = Matrix.Rotation(t, obj.direction).elements; }
x = this.elements[0] - C[0];
y = this.elements[1] - C[1];
z = this.elements[2] - C[2];
return Vector.create([
C[0] + R[0][0] * x + R[0][1] * y + R[0][2] * z,
C[1] + R[1][0] * x + R[1][1] * y + R[1][2] * z,
C[2] + R[2][0] * x + R[2][1] * y + R[2][2] * z
]);
break;
default:
return null;
}
},
*/

  /**
   * Returns the result of reflecting the point in the given point, line or plane.
   *
   * @param obj - The reflection point.
   * @returns The new vector.
   */
  public reflectionIn(obj: Vector) {
    /*
    if (obj.anchor) {
      // obj is a plane or line
      const P = this.elements.slice();
      const C = obj.pointClosestTo(P).elements;
      return Vector.create([
        C[0] + (C[0] - P[0]),
        C[1] + (C[1] - P[1]),
        C[2] + (C[2] - (P[2] || 0)),
      ]);
    }
*/
    // obj is a point
    const Q = getElements(obj);
    if (this.elements.length !== Q.length) {
      return null;
    }
    return this.map((x, i) => Q[i - 1] + (Q[i - 1] - x));
  }

  /**
   * Utility to make sure vectors are 3D. If they are 2D, a zero z-component is added.
   *
   * @returns The 3D vector.
   */
  public to3D() {
    const V = this.dup();
    switch (V.elements.length) {
      case 3:
        break;
      case 2:
        V.elements.push(0);
        break;
      default:
        return null;
    }
    return V;
  }

  /**
   * Returns a string representation of the vector.
   *
   * @returns The string vector.
   */
  public toString() {
    return `[${this.elements.join(', ')}]`;
  }

  /**
   * Set vector's elements from an array.
   *
   * @param els - The elements to set.
   * @returns The vector.
   */
  public setElements(els: VectorLike) {
    const V = getElements(els);
    this.elements = V.slice();
    return this;
  }
}
