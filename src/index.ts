import { Vector } from '../sylvester';
import Camera from './Camera';
import Renderer from './Renderer';
import Thing from './Thing';
import World from './World';
import { loop } from './util';

/**
 * Main program entry.
 */
async function main() {
  const renderer = new Renderer(
    document.getElementById('game-window') as HTMLElement,
  );
  const world = new World();
  const camera = new Camera();
  world.add(...(await Thing.createFromFile('./dist/monkey.obj')));
  renderer.setWorld(world);
  camera.position = new Vector([0, 0, -4]);
  renderer.camera = camera;
  renderer.render();

  renderer.speed = 10000;
  renderer.transition = 'ease';
  renderer.updateStyles();
  camera.position = camera.position.add([0, 0, 4]);
  renderer.render();

  (window as any).move = function move(movement: Vector) {
    camera.position = camera.position.add(movement);
    console.log(`New position: ${camera.position.toString()}`);
    renderer.render();
  };

  (window as any).zoom = function zoom(z: number) {
    camera.zoom = z;
    renderer.render();
  };

  (window as any).setTransitionSpeed = function setTransitionSpeed(speed: number) {
    renderer.speed = speed;
    renderer.updateStyles();
  };

  (window as any).setTransitionType = function setTransitionType(type: string) {
    renderer.transition = type;
    renderer.updateStyles();
  };
}

main();
