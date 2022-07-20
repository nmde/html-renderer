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
  private nodes: HTMLDivElement[] = [];

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
    const start = new Date();
    const computed = window.getComputedStyle(this.container);
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
    const t1 = new Date();
    console.log(`Calculated projection in ${+t1 - +start}`);
    // Cast rays
    const intersections: Record<number, Record<number, boolean>> = (
      window as any
    ).castRays(leftBound, rightBound, topBound, bottomBound, projected);
    console.log(intersections);
    const t2 = new Date();
    console.log(`Cast rays in ${+t2 - +t1}`);
    const polygons: number[][] = [];
    Object.entries(intersections).forEach(([x, row]) => {
      let rect: number[] = [0, 0];
      let buildingPolygon = false;
      Object.entries(row).forEach(([y, intersects]) => {
        if (intersects) {
          if (buildingPolygon) {
            rect[1] = Number(y);
          } else {
            buildingPolygon = true;
            rect[0] = Number(y);
          }
        } else if (buildingPolygon) {
          buildingPolygon = false;
          polygons.push([Number(x), ...rect]);
          rect = [0, 0];
        }
      });
      if (buildingPolygon) {
        polygons.push([Number(x), ...rect]);
      }
    });
    const t3 = new Date();
    console.log(`Calculated polygons in ${+t3 - +t2}`);

    // TODO: try to adjust existing nodes instead of erasing/creating new ones
    // Also test if that actually is more efficient
    console.log(polygons);
    this.nodes.forEach((node) => {
      node.parentNode?.removeChild(node);
    });
    /*
    polygons.forEach((polygon) => {
      const polygonNode = document.createElement('div');
      polygonNode.classList.add('point');
      polygonNode.style.left = `${polygon[0]}px`;
      polygonNode.style.top = `${polygon[1]}px`;
      polygonNode.style.height = `${polygon[2] - polygon[1]}px`;
      this.container.appendChild(polygonNode);
      this.nodes.push(polygonNode);
    });
    const end = new Date();
    console.log(`Built DOM in ${+end - +t3}`);
    console.log(`Total render time: ${+end - +start}`);
    */
    Object.entries(intersections).forEach(([x, row]) => {
      Object.entries(row).forEach(([y, intersects]) => {
        if (intersects) {
          const polygonNode = document.createElement('div');
          polygonNode.classList.add('point');
          polygonNode.style.left = `${x}px`;
          polygonNode.style.top = `${y}px`;
          polygonNode.style.height = '1px';
          polygonNode.style.width = '1px';
          this.container.appendChild(polygonNode);
          this.nodes.push(polygonNode);
        }
      });
    });
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
