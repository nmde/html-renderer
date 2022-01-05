import Camera from './Camera';
import Vector from './Vector';
import World from './World';

/**
 * Renders.
 */
export default class Renderer {
  /**
   * The current camera perspective to use.
   */
  private camera = new Camera();

  /**
   * The DOM element to render within.
   */
  private container: HTMLElement;

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
   *
   * @param world - The world state to render.
   */
  public render(world: World) {
    this.container.innerHTML = '';
    this.container.appendChild(world.build());
    const computed = window.getComputedStyle(this.container);
    const center = new Vector(
      Number(computed.width.replace('px', '')) / 2,
      Number(computed.height.replace('px', '')) / 2,
      0,
    );
    Object.entries(world.state).forEach(([id, thing]) => {
      const node = document.getElementById(id);
      if (node) {
        const thingCenter = center.add(thing.location);
        node.style.left = `${thingCenter.x}px`;
        node.style.bottom = `${thingCenter.y}px`;
        Array.from(node.getElementsByClassName('vertex')).forEach((v) => {
          const vertex = v as HTMLElement;
          const coords = vertex
            .getAttribute('data-vertex')
            ?.split(',')
            .map((val) => Number(val));
          if (coords) {
            // Position in world plane
            const position = thing.location.add(new Vector(coords[0], coords[1], coords[2]));
            // Position in observation plane
            const obsPosition = this.camera.location.add(position);
            const dz = this.camera.zoom / position.z;
            // Projection onto the observation plane
            const projection = new Vector(obsPosition.x * dz, obsPosition.y * dz, 0);
            vertex.style.left = `${projection.x}px`;
            vertex.style.bottom = `${projection.y}px`;
            vertex.style.height = `${obsPosition.z * (1 / dz) * 0.05}px`;
            vertex.style.width = `${obsPosition.z * (1 / dz) * 0.05}px`;
          }
        });
      }
    });
  }

  /**
   * Sets the camera to use.
   *
   * @param camera - The camera to use.
   */
  public setCamera(camera: Camera) {
    this.camera = camera;
  }
}
