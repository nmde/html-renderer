import Camera from './Camera';
import Vector from './Vector';
import World from './World';
import { Coordinate } from './types';
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
    const width = Number(computed.width.replace('px', ''));
    const height = Number(computed.height.replace('px', ''));
    const center = new Vector([width / 2, height / 2]);
    this.world?.things.forEach((entry) => {
      const thing = entry[1];
      const thingNode = document.getElementById(entry[0]);
      const vertexNodes = thingNode?.getElementsByClassName(
        'vertex',
      ) as HTMLCollectionOf<HTMLElement>;
      const computedVertices: Coordinate[] = [];
      for (let v = 0; v < thing.vertices.length; v += 1) {
        const vertex = thing.vertices[v];
        const vertexNode = vertexNodes[v];
        const position = new Vector([vertex.x, vertex.y, vertex.z]);
        const relativePosition = this.camera.position.add(position);
        const w = relativePosition.z;
        const projection = new Vector([
          (relativePosition.x * width) / (2 * w),
          (relativePosition.y * height) / (2 * w),
        ]);
        // todo: clipping
        computedVertices[v] = {
          x: projection.x + center.x,
          y: projection.y + center.y,
          z: position.z + 1,
        };
        if (vertexNode) {
          vertexNode.style.left = `${computedVertices[v].x}px`;
          vertexNode.style.top = `${computedVertices[v].y}px`;
          const size = (1 / relativePosition.norm) * this.camera.zoom;
          vertexNode.style.height = `${size}px`;
          vertexNode.style.width = `${size}px`;
          vertexNode.style.zIndex = `${computedVertices[v].z}`;
        }
      }
      const faceNodes = thingNode?.getElementsByClassName(
        'face',
      ) as HTMLCollectionOf<HTMLElement>;
      for (let f = 0; f < thing.faces.length; f += 1) {
        const face = thing.faces[f];
        const faceNode = faceNodes[f];
        let clipPath = '';
        face.vertices.forEach((index) => {
          const vertex = computedVertices[index];
          clipPath += `, ${vertex.x}px ${vertex.y}px`;
        });
        clipPath = clipPath.substring(2);
        faceNode.style.clipPath = `polygon(${clipPath})`;
      }
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
