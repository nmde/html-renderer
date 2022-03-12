import { Vector } from '../sylvester';
import Thing from './Thing';

/**
 * Controls what is visible in the render.
 */
export default class Camera extends Thing {
  public near = 1;

  public far = 2;

  /**
   * Field of view.
   */
  public fov = 90;

  /**
   * The current position of the camera.
   */
  public position = Vector.Zero(3);

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
