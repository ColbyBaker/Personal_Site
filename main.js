import './style.css';
import * as THREE from 'three';
import p5 from 'p5';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera, SphereGeometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

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

const allPlanets = [sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, pluto];
let allRockets = [];

const loadPlanetModels = () => {
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
  camera.position.setY(0);

  // const spaceTexture = new THREE.TextureLoader().load('./resources/bg.jpg');
  // scene.background = spaceTexture;

  const pointLight = new THREE.PointLight(0xffffff);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  pointLight.position.set(8, 8, 8);
  scene.add(pointLight, ambientLight);
  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper(200, 20)
  scene.add(gridHelper)

  const controls = new OrbitControls(camera, renderer.domElement)

  scene.add(lightHelper);

  const gui = new GUI()
  let rollup = gui.addFolder('Perspective');
  rollup.add(camera.position, "y", 0.0, 100.0);

  loadPlanetModels();

  const numberOfRockets = 30;
  for (let x = 0; x < numberOfRockets; x++) {
    addRocket();
  }

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  allRockets.forEach((currentRocket) => {
    currentRocket.update(allRockets);
  })

  //earth.model.rotation.y += .01;
  // mars.rotation.y += .007;

  // controls.update()


  renderer.render(scene, camera);
}

function init() {
  startRenderer()
}

const addRocket = () => {
  const min = -20;
  const max = 20;
  const initialX = Math.round(Math.random() * (max - min) + min);
  const initialY = Math.round(Math.random() * (max - min) + min);
  const initialZ = Math.round(Math.random() * (max - min) + min);
  const initialPosition = [initialX, initialY, initialZ];

  const newRocket = new Rocket(initialPosition);
  allRockets.push(newRocket);
  newRocket.asyncLoadModel()
    .then(model => {
      scene.add(model);
    })
}

init();

