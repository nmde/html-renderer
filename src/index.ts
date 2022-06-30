import Camera from './Camera';
import Renderer from './Renderer';
import Thing from './Thing';
import Vector from './Vector';
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
  const things = await Thing.createFromFile('./dist/scene.obj');
  world.add(...things);
  renderer.setWorld(world);
  camera.position = new Vector([0, -2, -13]);
  renderer.camera = camera;
  renderer.render();

  renderer.speed = 100;
  renderer.transition = 'ease';
  renderer.updateStyles();

  (window as any).rotate = function rotate(
    obj: number,
    axis: number[],
    rotation: number[],
    angle: number,
  ) {
    loop(
      () => {
        things[obj].rotate(new Vector(axis), new Vector(rotation), Math.PI / 180);
        renderer.render();
      },
      renderer.speed,
      (angle * (Math.PI / 180)) / (Math.PI / 180),
    );
  };

  (window as any).move = function move(movement: Vector) {
    camera.position = camera.position.add(movement);
    console.log(`New position: ${camera.position.toString()}`);
    renderer.render();
  };

  (window as any).zoom = function zoom(z: number) {
    camera.zoom = z;
    renderer.render();
  };

  (window as any).setTransitionSpeed = function setTransitionSpeed(
    speed: number,
  ) {
    renderer.speed = speed;
    renderer.updateStyles();
  };

  (window as any).setTransitionType = function setTransitionType(type: string) {
    renderer.transition = type;
    renderer.updateStyles();
  };
}

main();
