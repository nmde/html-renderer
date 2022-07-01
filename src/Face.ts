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
   * Gets the current smallest Z value in the face's vertices.
   * 
   * @returns The min z.
   */
  public get minZ(): number {
    let minZ = Infinity;
    this.vertices.forEach((vertex) => {
      if (vertex.z < minZ) {
        minZ = vertex.z;
      }
    });
    return minZ;
  }
}
