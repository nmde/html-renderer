import Vector from './Vector';

/**
 * Represents a thing.
 */
export default class Thing {
  /**
   * Unique ID of the Thing within the world.
   */
  private id = '';

  /**
   * The current location of the Thing.
   */
  public location = new Vector(0, 0, 0);

  /**
   * The current orientation of the Thing.
   */
  private orientation = new Vector(0, 0, 0);

  /**
   * Verticies of the object.
   */
  private verticies: Vector[] = [];

  /**
   * Adds a vertex.
   *
   * @param location - Location of the vertex relative to the center of mass.
   */
  public addVertex(location: Vector): void {
    this.verticies.push(location);
  }

  /**
   * Shortcut for adding many verticies.
   *
   * @param verticies - Verticies to add.
   */
  public addVerticies(...verticies: Vector[]) {
    this.verticies = this.verticies.concat(verticies);
  }

  /**
   * Constructs the DOM representation of the Thing.
   *
   * @returns The DOM node.
   */
  public build() {
    const node = document.createElement('div');
    node.classList.add('thing');
    this.verticies.forEach((vertex) => {
      const vertexNode = document.createElement('div');
      vertexNode.classList.add('vertex');
      vertexNode.setAttribute('data-vertex', `${vertex.x},${vertex.y},${vertex.z}`);
      node.appendChild(vertexNode);
    });
    return node;
  }

  /**
   * Creates a solid plane between the specified verticies.
   *
   * @param verticies - The bounds of the plane.
   */
  public createPlane(...verticies: Vector[]) {

  }

  /**
   * Sets the ID of the thing.
   *
   * @param id - The ID.
   */
  public setId(id: string) {
    this.id = id;
  }

  /**
   * Sets the location of the Thing.
   *
   * @param location - The new location.
   */
  public setLocation(location: Vector) {
    this.location = location;
  }

  /**
   * Sets the orientation.
   *
   * @param orientation - The new orientation.
   */
  public setOrientation(orientation: Vector) {
    this.orientation = orientation;
  }

  /**
   * Creates verticies for a rectangular prism.
   *
   * @param x - The x size.
   * @param y - The y size.
   * @param z - The z size.
   */
  public toRectangle(x: number, y: number, z: number) {
    const x2 = x / 2;
    const y2 = y / 2;
    const z2 = z / 2;
    this.verticies = Vector.from(
      [x2, y2, z2], // 0
      [x2, y2, -z2], // 1
      [x2, -y2, z2], // 2
      [x2, -y2, -z2], // 3
      [-x2, y2, z2], // 4
      [-x2, y2, -z2], // 5
      [-x2, -y2, z2], // 6
      [-x2, -y2, -z2], // 7
    );
    this.createPlane(this.verticies[0], this.verticies[1], this.verticies[2], this.verticies[3]);
    this.createPlane(this.verticies[0], this.verticies[1], this.verticies[4], this.verticies[5]);
    this.createPlane(this.verticies[4], this.verticies[5], this.verticies[6], this.verticies[7]);
    this.createPlane(this.verticies[2], this.verticies[3], this.verticies[6], this.verticies[7]);
    this.createPlane(this.verticies[0], this.verticies[2], this.verticies[4], this.verticies[6]);
    this.createPlane(this.verticies[1], this.verticies[3], this.verticies[5], this.verticies[7]);
  }
}
