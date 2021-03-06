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
}
