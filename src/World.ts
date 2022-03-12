import { Vector } from '../sylvester';
import Thing from './Thing';

/**
 * Stores information about the world.
 */
export default class World {
  /**
   * Stores information about objects within the world.
   */
  private state: Record<string, Thing> = {};

  /**
   * Adds Things to the world.
   *
   * @param objs - The Thing(s) to add.
   */
  public add(...objs: Thing[]) {
    objs.forEach((obj) => {
      this.state[obj.id] = obj;
    });
  }

  /**
   * The things in the world.
   *
   * @returns The things in the world.
   */
  public get things() {
    return Object.entries(this.state);
  }

  /**
   * Builds the DOM representation of the world.
   *
   * @param vertices - If vertex nodes should be built.
   * @returns The world DOM node.
   */
  public build(vertices = false) {
    const node = document.createElement('div');
    node.classList.add('world');
    Object.entries(this.state).forEach((entry) => {
      node.appendChild(entry[1].build(vertices));
    });
    return node;
  }

  /**
   * Moves a Thing.
   *
   * @param thing - The Thing to move.
   * @param movement - The movement to apply.
   */
  public move(thing: Thing, movement: Vector) {
    this.state[thing.id].move(movement);
  }

  /**
   * Rotates a Thing.
   *
   * @param thing - The Thing to rotate.
   * @param axis - The axis to rotate around.
   * @param rotation - The rotation to apply.
   */
  public rotate(thing: Thing, axis: Vector, rotation: Vector) {
    this.state[thing.id].rotate(axis, rotation);
  }
}
