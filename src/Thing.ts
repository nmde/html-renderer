import axios from 'axios';
import ObjFileParser from 'obj-file-parser';
import { v4 as uuid } from 'uuid';
import { Coordinate } from './types';

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
        thing.vertices = model.vertices;
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
  private vertices: Coordinate[] = [];

  /**
   * Constructs the DOM representation of the Thing.
   *
   * @returns The DOM node.
   */
  public build() {
    const node = document.createElement('div');
    node.classList.add('thing');
    node.id = this.id;
    this.vertices.forEach((vertex) => {
      const vertexNode = document.createElement('div');
      vertexNode.classList.add('vertex');
      vertexNode.setAttribute(
        'data-position',
        `${vertex.x},${vertex.y},${vertex.z}`,
      );
      node.appendChild(vertexNode);
    });
    return node;
  }
}
