import './style.css';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera, SphereGeometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import p5 from 'p5';

import Rocket from './rocket.js';
import Planet from './planet.js';

let camera, scene, renderer, loader;

let sun = new Planet([0, 0, 0], 'sun.glb');
let mercury = new Planet([0, 14, 0], 'mercury.glb');
let venus = new Planet([0, 22, 0], 'venus.glb');
let earth = new Planet([0, 31, 0], 'earth.glb');
let moon = new Planet([0, 34.5, 0], 'moon.glb');
let mars = new Planet([0, 42, 0], 'mars.glb');
let jupiter = new Planet([0, 55, 0], 'jupiter.glb');
let saturn = new Planet([0, 69, 0], 'saturn.glb');
let uranus = new Planet([0, 81, 0], 'uranus.glb');
let neptune = new Planet([0, 91, 0], 'neptune.glb');
let pluto = new Planet([0, 102, 0], 'pluto.glb');
//You heard about Pluto? That's messed up right?

const loadPlanetModels = () => {
  const allPlanets = [sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, pluto];
  const planetPromises = allPlanets.map((currentPlanet) => {
    return currentPlanet.asyncLoadModel();
  });

  return Promise.all(planetPromises).then(() => {
    allPlanets.forEach((currentPlanet) => {
      scene.add(currentPlanet.model)
    })
  })
}

const startRenderer = () => {
  loader = new GLTFLoader();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  })

  renderer.setPixelRatio(window.devicePixeRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  camera.position.setZ(50);
  camera.position.setY(20);

  // const spaceTexture = new THREE.TextureLoader().load('./resources/bg.jpg');
  // scene.background = spaceTexture;

  const pointLight = new THREE.PointLight(0xffffff);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  pointLight.position.set(8, 8, 8);
  scene.add(pointLight, ambientLight);
  const lightHelper = new THREE.PointLightHelper(pointLight);

  const controls = new OrbitControls(camera, renderer.domElement)

  scene.add(lightHelper);

  const gui = new GUI()
  let rollup = gui.addFolder('Perspective');
  rollup.add(camera.position, "y", 0.0, 100.0);

  loadPlanetModels();

  addRocket([-20, 20, 20]);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  //earth.model.rotation.y += .01;
  // mars.rotation.y += .007;

  // theta += dTheta;
  // mercuryTheta += mercuryDTheta;

  // moon.position.x = r * Math.cos(theta);
  // moon.position.y = r * Math.sin(theta);
  // moon.rotation.y += .005;

  // theta += dTheta;
  // mercury.position.x = r * Math.cos(mercuryTheta);
  // mercury.position.y = r * Math.sin(mercuryTheta);

  // venus.position.x = (r + 5) * Math.cos(theta);
  // venus.position.y = (r + 5) * Math.sin(theta);


  // controls.update()


  renderer.render(scene, camera);
}

function init() {
  startRenderer()
}

const addRocket = (initialPosition) => {
  const newRocket = new Rocket(initialPosition);
  newRocket.asyncLoadModel()
    .then(model => {
      scene.add(model);
    })
}

init();

