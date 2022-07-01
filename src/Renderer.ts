import { dist } from 'gl-vec3';
import Camera from './Camera';
import Face from './Face';
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
    this.world?.things.forEach(([, thing]) => {
      const surfaces: Face[] = [];
      // Calculate bounding rectangles
      // TODO: calculate overlap within rectangles for better accuracy
      thing.faces.forEach((face, f) => {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        const projectedVertices = face.vertices.map((vertex) => {
          // Calculate current projection
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
          // Calculate bounding rectangle
          if (projection.x < minX) {
            minX = projection.x;
          }
          if (projection.y < minY) {
            minY = projection.y;
          }
          if (projection.x > maxX) {
            maxX = projection.x;
          }
          if (projection.y > maxY) {
            maxY = projection.y;
          }
          return projection;
        });
        thing.faces[f].boundingRectangle = [minX, maxX, minY, maxY];
        // Check if the face is completely obscured by existing faces
        let collides = false;
        surfaces.forEach((surfaceFace) => {
          const bR2 = surfaceFace.boundingRectangle;
          collides =
            collides ||
            (bR2[0] >= minX &&
              bR2[1] <= maxX &&
              bR2[3] <= minY &&
              bR2[4] >= maxY &&
              dist(this.camera.position.value, [minX, minY, face.minZ]) >
                dist(this.camera.position.value, [
                  surfaceFace.boundingRectangle[0],
                  surfaceFace.boundingRectangle[2],
                  surfaceFace.minZ,
                ]));
          // TODO: overwrite faces that the current face obscures
        });
        // Create the face
        if (!collides) {
          surfaces.push(thing.faces[f]);
          const faceNode = document.createElement('div');
          faceNode.classList.add('face');
          faceNode.style.left = `${minX}px`;
          faceNode.style.width = `${maxX - minX}px`;
          faceNode.style.top = `${minY}px`;
          faceNode.style.height = `${maxY - minY}px`;
          let clipPath = '';
          projectedVertices.forEach((vertex) => {
            clipPath += `, ${vertex.x - minX}px ${vertex.y - minY}px`;
          });
          faceNode.style.clipPath = `polygon(${clipPath.substring(2)})`;
          this.container.appendChild(faceNode);
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
