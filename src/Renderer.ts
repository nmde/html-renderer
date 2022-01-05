import { Vector } from '../sylvester';
import Camera from './Camera';
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
    const width = Number(computed.width.replace('px', ''));
    const height = Number(computed.height.replace('px', ''));
    const center = new Vector([width / 2, height / 2]);
    Array.from(this.container.getElementsByClassName('vertex')).forEach((v) => {
      const vertex = v as HTMLElement;
      const coords = vertex
        .getAttribute('data-position')
        ?.split(/,/)
        .map((n) => Number(n));
      if (coords) {
        const position = new Vector(coords);
        const fov = 1.0 / Math.tan(this.camera.fov / 2);
        const aspectRatio = width / height;
        const { near, far } = this.camera;
        /*
        const clip = Matrix.create([
          [fov * aspectRatio, 0, 0, 0],
          [0, fov, 0, 0],
          [0, 0, (far + near) / (far - near), 1],
          [0, 0, (2 * near * far) / (near - far), 0],
        ]);
        */
        const relativePosition = this.camera.position.add(position);
        const w = relativePosition.z;
        const projection = new Vector([
          (relativePosition.x * width) / (2 * w),
          (relativePosition.y * height) / (2 * w),
        ]);
        // todo: clipping
        vertex.style.left = `${projection.x + center.x}px`;
        vertex.style.top = `${projection.y + center.y}px`;
        const size = (1 / relativePosition.norm) * this.camera.zoom;
        vertex.style.height = `${size}px`;
        vertex.style.width = `${size}px`;
        vertex.style.zIndex = `${position.z + 1}`;
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
    this.container.appendChild(world.build());
    this.styleContainer = document.createElement('style');
    this.container.appendChild(this.styleContainer);
    this.updateStyles();
  }

  /**
   * Re-compiles the dynamic styles.
   */
  public updateStyles() {
    if (this.styleContainer) {
      this.styleContainer.innerHTML = `.vertex { transition: all ${this.speed}ms ${this.transition} }`;
    }
  }
}
