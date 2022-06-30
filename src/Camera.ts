import Thing from './Thing';
import Vector from './Vector';

/**
 * Controls what is visible in the render.
 */
export default class Camera extends Thing {
  /**
   * Field of view.
   */
  public fov = 90;

  /**
   * The current position of the camera.
   */
  public position = new Vector([0, 0, 0]);

  /**
   * Zoom level of the camera.
   */
  public zoom = 20;

  /**
   * Constructs Camera.
   */
  public constructor() {
    super();
  }
}
