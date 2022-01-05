import { v4 as uuid } from 'uuid';
import Thing from './Thing';
import Vector from './Vector';

/**
 * Stores information about the world.
 */
export default class World {
  /**
   * Stores information about objects within the world.
   */
  public state: Record<string, Thing> = {};

  /**
   * Add a thing to the world.
   *
   * @param obj - The thing to add.
   * @param location - Initial location to place the object.
   */
  public add(obj: Thing, location: Vector) {
    const id = uuid();
    obj.setId(id);
    obj.setLocation(location);
    this.state[id] = obj;
  }

  /**
   * Builds the DOM representation of the world.
   *
   * @returns The world DOM node.
   */
  public build() {
    const node = document.createElement('div');
    node.classList.add('world');
    Object.entries(this.state).forEach(([id, thing]) => {
      const thingNode = thing.build();
      thingNode.id = id;
      node.appendChild(thingNode);
    });
    return node;
  }
}
