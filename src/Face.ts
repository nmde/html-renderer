import Vector from './Vector';

/**
 * Represents an object face.
 */
export default class Face {
  /**
   * The bounding rectangle (calculating during rendering).
   */
  public boundingRectangle: number[] = [];

  /**
   * Vertices of the face.
   */
  public vertices: Vector[];

  /**
   * Constructs Face.
   *
   * @param vertices - Bounding vertices.
   */
  public constructor(vertices: Vector[]) {
    this.vertices = vertices;
  }

  /**
   * Calculates the bounding rectangle.
   *
   * @returns The bounding rectangle.
   */
  public get bounds(): number[] {
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;
    this.vertices.forEach((vertex) => {
      if (vertex.x < minX) {
        minX = vertex.x;
      }
      if (vertex.y < minY) {
        minY = vertex.y;
      }
      if (vertex.z < minZ) {
        minZ = vertex.z;
      }
      if (vertex.x > maxX) {
        maxX = vertex.x;
      }
      if (vertex.y > maxY) {
        maxY = vertex.y;
      }
      if (vertex.z > maxZ) {
        maxZ = vertex.z;
      }
    });
    return [minX, maxX, minY, maxY, minZ, maxZ];
  }

  /**
   * Gets a point in the middle of the face.
   *
   * @returns The midpoint.
   */
  public get midpoint(): Vector {
    return new Vector([
      (this.bounds[0] + this.bounds[1]) / 2,
      (this.bounds[2] + this.bounds[3]) / 2,
      (this.bounds[4] + this.bounds[5]) / 2,
    ]);
  }
}
