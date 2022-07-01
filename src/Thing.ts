import axios from 'axios';
import ObjFileParser from 'obj-file-parser';
import { v4 as uuid } from 'uuid';
import Face from './Face';
import RotationMatrix from './RotationMatrix';
import Vector from './Vector';

/**
 * Represents a thing.
 */
export default class Thing {
  /**
   * Creates Things from models in a .obj file.
   *
   * @param path - The URL of the file.
   * @returns Thing objects from the file.
   */
  public static async createFromFile(path: string): Promise<Thing[]> {
    return new ObjFileParser((await axios.get(path)).data)
      .parse()
      .models.map((model) => {
        const thing = new Thing();
        thing.vertices = model.vertices.map(
          (vertex) => new Vector([vertex.x, vertex.y, vertex.z]),
        );
        let minIndex: number;
        model.faces.forEach((face) => {
          face.vertices.forEach((vertex) => {
            if (!minIndex || vertex.vertexIndex < minIndex) {
              minIndex = vertex.vertexIndex;
            }
          });
        });
        thing.faces = model.faces.map(
          (face) =>
            new Face(
              face.vertices.map(
                (vertex) => thing.vertices[vertex.vertexIndex - minIndex],
              ),
            ),
        );
        return thing;
      });
  }

  /**
   * The unique ID of the Thing.
   */
  public id = uuid();

  /**
   * Object vertices.
   */
  public vertices: Vector[] = [];

  /**
   * Object faces.
   */
  public faces: Face[] = [];

  /**
   * Moves the Thing.
   *
   * @param movement - The movement to apply.
   */
  public move(movement: Vector) {
    for (let i = 0; i < this.vertices.length; i += 1) {
      this.vertices[i] = this.vertices[i].add(movement);
    }
  }

  /**
   * Rotates the Thing.
   *
   * @param axis - The axis to rotate around.
   * @param direction - The rotation to apply.
   * @param angle - The angle to rotate.
   */
  public rotate(axis: Vector, direction: Vector, angle: number) {
    const rMatrix = new RotationMatrix(axis, direction, angle);
    for (let i = 0; i < this.vertices.length; i += 1) {
      this.vertices[i] = rMatrix.timesXYZ(this.vertices[i]);
    }
  }
}
