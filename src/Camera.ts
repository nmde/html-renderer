import Thing from './Thing';

/**
 * Controls what is visible in the render.
 */
export default class Camera extends Thing {
  /**
   * Zoom level of the camera.
   */
  public zoom = 100;

  /**
   * Constructs Camera.
   */
  public constructor() {
    super();
    this.toRectangle(1, 0, 1);
  }
}
