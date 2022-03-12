import axios from 'axios';
import { matrix, multiply } from 'mathjs';
import ObjFileParser from 'obj-file-parser';
import { v4 as uuid } from 'uuid';
import { Vector } from '../sylvester';
import { Face } from './types';

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
        thing.faces = model.faces.map((face) => ({
          vertices: face.vertices.map(
            (vertex) => vertex.vertexIndex - minIndex,
          ),
        }));
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
   * Constructs the DOM representation of the Thing.
   *
   * @param vertices - If vertices should be built.
   * @returns The DOM node.
   */
  public build(vertices = false) {
    const node = document.createElement('div');
    node.classList.add('thing');
    node.id = this.id;
    if (vertices) {
      this.vertices.forEach((vertex) => {
        const vertexNode = document.createElement('div');
        vertexNode.classList.add('vertex');
        vertexNode.setAttribute(
          'data-position',
          `${vertex.x},${vertex.y},${vertex.z}`,
        );
        node.appendChild(vertexNode);
      });
    }
    this.faces.forEach((face) => {
      const faceNode = document.createElement('div');
      faceNode.classList.add('face');
      faceNode.setAttribute('data-vertices', JSON.stringify(face.vertices));
      node.appendChild(faceNode);
    });
    return node;
  }

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
   * @param rotation - The rotation to apply.
   */
  public rotate(axis: Vector, rotation: Vector) {
    const r = rotation.map((angle) => (angle * Math.PI) / 180);
    const yaw = matrix([
      [Math.cos(r.z), -Math.sin(r.z), 0],
      [Math.sin(r.z), Math.cos(r.z), 0],
      [0, 0, 1],
    ]);
    const pitch = matrix([
      [Math.cos(r.y), 0, Math.sin(r.y)],
      [0, 1, 0],
      [-Math.sin(r.y), 0, Math.cos(r.y)],
    ]);
    const roll = matrix([
      [1, 0, 0],
      [0, Math.cos(r.x), -Math.sin(r.x)],
      [0, Math.sin(r.x), Math.cos(r.x)],
    ]);
    const rMatrix = multiply(yaw, multiply(pitch, roll));
    for (let i = 0; i < this.vertices.length; i += 1) {
      const vertex = this.vertices[i];
      const vMatrix = matrix([[vertex.x], [vertex.y], [vertex.z]]);
      const result = multiply(rMatrix, vMatrix).toArray() as number[][];
      this.vertices[i] = new Vector([result[0][0], result[1][0], result[2][0]]);
    }
  }
}
