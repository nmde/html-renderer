import pointInPolgyon from 'point-in-polygon';
import Camera from './Camera';
import Face from './Face';
import Thing from './Thing';
import Vector from './Vector';
import World from './World';
import './index.css';

/**
 * Renders.
 */
export default class Renderer {
  /**
   * The current camera perspective to use.
   */
  public camera = new Camera();

  /**
   * The DOM element to render within.
   */
  private container: HTMLElement;

  /**
   * Nodes that display the render.
   */
  private nodes: Record<string, Record<string, HTMLDivElement>> = {};

  /**
   * Animation speed (ms).
   */
  public speed = 500;

  /**
   * Animation transition function.
   */
  public transition = 'linear';

  /**
   * Contains dynamic CSS styles.
   */
  private styleContainer: HTMLStyleElement | null = null;

  /**
   * The currently loaded World.
   */
  private world: World | null = null;

  /**
   * Constructs Renderer.
   *
   * @param container - The DOM element to render within.
   */
  public constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Renders a single frame.
   */
  public render() {
    const computed = window.getComputedStyle(this.container);
    // TODO: don't create new nodes each render
    this.container.innerHTML = '';
    const width = Number(computed.width.replace('px', ''));
    const height = Number(computed.height.replace('px', ''));
    const center = new Vector([width / 2, height / 2]);
    let leftBound = Infinity;
    let rightBound = -Infinity;
    let topBound = Infinity;
    let bottomBound = -Infinity;
    // Calculate projections onto the screen
    const projected = this.world?.things.map(([, thing]) => {
      // TODO: calculate overlap within rectangles for better accuracy
      const projectedThing = new Thing();
      projectedThing.faces = thing.faces.map((face) => {
        return new Face(
          face.vertices.map((vertex) => {
            const relativePosition = this.camera.position.add(vertex);
            const projection = new Vector(
              [
                (relativePosition.x * width) / (2 * relativePosition.z) +
                  center.x,
                (relativePosition.y * height) / (2 * relativePosition.z) +
                  center.y,
                vertex.z,
              ].map((v) => Number(v.toPrecision(4))),
            );
            if (projection.x < leftBound) {
              leftBound = Math.floor(projection.x);
            }
            if (projection.x > rightBound) {
              rightBound = Math.ceil(projection.x);
            }
            if (projection.y < topBound) {
              topBound = Math.floor(projection.y);
            }
            if (projection.y > bottomBound) {
              bottomBound = Math.ceil(projection.y);
            }
            return projection;
          }),
        );
      });
      return projectedThing;
    });
    // Cast rays
    const intersections: Record<number, Record<number, number>> = {};
    for (let x = leftBound; x < rightBound; x += 1) {
      for (let y = topBound; y < bottomBound; y += 1) {
        const ray = new Vector([x, y, this.camera.position.z]);
        projected?.forEach((thing) => {
          let intersects = false;
          let f = 0;
          while (!intersects && f < thing.faces.length) {
            intersects = pointInPolgyon(
              [ray.x, ray.y],
              thing.faces[f].vertices.map((vertex) => [
                vertex.value[0],
                vertex.value[1],
              ]),
            );
            f += 1;
          }
          if (intersects) {
            if (!intersections[x]) {
              intersections[x] = {};
            }
            intersections[x][y] = ray.z;
          }
        });
      }
    }
    for (let x = leftBound; x < rightBound; x += 1) {
      for (let y = topBound; y < bottomBound; y += 1) {
        if (intersections[x] && intersections[x][y]) {
          if (this.nodes[x] && this.nodes[x][y]) {
            this.nodes[x][y].style.display = 'block';
          } else {
            const pointNode = document.createElement('div');
            pointNode.classList.add('point');
            pointNode.style.left = `${x}px`;
            pointNode.style.top = `${y}px`;
            pointNode.style.zIndex = `${intersections[x][y]}`;
            this.container.appendChild(pointNode);
            if (!this.nodes[x]) {
              this.nodes[x] = {};
            }
            this.nodes[x][y] = pointNode;
          }
        } else {
          if (this.nodes[x] && this.nodes[x][y]) {
            this.nodes[x][y].style.display = 'none';
          }
        }
      }
    }
  }

  /**
   * Sets the target World to render.
   *
   * @param world - The World to render.
   */
  public setWorld(world: World) {
    this.world = world;
    this.styleContainer = document.createElement('style');
    this.container.appendChild(this.styleContainer);
    this.updateStyles();
  }

  /**
   * Re-compiles the dynamic styles.
   */
  public updateStyles() {
    if (this.styleContainer) {
      this.styleContainer.innerHTML = `.vertex, .face { transition: all ${this.speed}ms ${this.transition} }`;
    }
  }
}
