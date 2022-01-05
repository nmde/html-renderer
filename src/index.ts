import './index.css';
import Camera from './Camera';
import Renderer from './Renderer';
import Thing from './Thing';
import Vector from './Vector';
import World from './World';

const renderer = new Renderer(
  document.getElementById('game-window') as HTMLElement,
);
const world = new World();
const camera = new Camera();

const cube = new Thing();
cube.toRectangle(100, 100, 100);

world.add(cube, new Vector(0, 0, 0));
world.add(camera, new Vector(100, 100, 100));
// camera.setOrientation(new Vector(-1, 1, -1));

renderer.setCamera(camera);
renderer.render(world);

setInterval(() => {
  camera.setLocation(camera.location.add(new Vector(0, -1, 0)));
  renderer.render(world);
}, 100);
