import './style.css';
import * as THREE from 'three';
import p5 from 'p5';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import Rocket from './rocket';
import Planet from './planet';
import threeDObject from './threeDObject';
import thirdPersonCamera from './thirdPersonCamera';

let camera, scene, renderer, loader;
let cameraThirdPerson;
let controls;

let inputRockets = 0;
document.getElementById("addRocket").addEventListener("click", () => {
  inputRockets = document.getElementById("inputNumberRockets").value;
  for (let x = 0; x < inputRockets; x++) {
    addRocket();
  }
})

let sun = new Planet([0, 0, 0, 0], 'sun.glb');
let mercury = new Planet([0, 0, 14], 'mercury.glb', 241);
let venus = new Planet([0, 0, 22], 'venus.glb', 615);
let earth = new Planet([0, 0, 31], 'earth.glb', 1000);
let moon = new Planet([0, 0, 34.5], 'moon.glb');
let mars = new Planet([0, 0, 42], 'mars.glb', 1880);
let jupiter = new Planet([0, 0, 55], 'jupiter.glb', 11900);
let saturn = new Planet([0, 0, 69], 'saturn.glb', 29400);
let uranus = new Planet([0, 0, 81], 'uranus.glb', 83700);
let neptune = new Planet([0, 0, 91], 'neptune.glb', 163700);
let pluto = new Planet([0, 0, 102], 'pluto.glb', 247900);
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
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  })


  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-5, 27.5, -1.7);
  cameraThirdPerson = new thirdPersonCamera(camera);

  


  

  renderer.setPixelRatio(window.devicePixeRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  controls = new OrbitControls(camera, renderer.domElement)


  const spaceTexture = new THREE.TextureLoader().load('./resources/space_background.jpg');
  //scene.background = spaceTexture;

  const pointLight = new THREE.PointLight(0xffffff, 1.3);
  const ambientLight = new THREE.AmbientLight(0xffffff, .3);
  //pointLight.position.set(8, 8, 8);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight, ambientLight);
  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper(200, 20)
  //scene.add(gridHelper)
  scene.add(lightHelper); 

  // const gui = new GUI()
  // let rollup = gui.addFolder('Perspective');
  // rollup.add(camera.position, "z", 0.0, 110.0);


  loadPlanetModels();

  const initialNumberOfRockets = 40;
  for (let x = 0; x < initialNumberOfRockets; x++) {
    addRocket();
  }

  addStars(9000);
  //addStars(2000);
  cameraThirdPerson.setTarget(earth);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  allRockets.forEach((currentRocket) => {
    currentRocket.update(allRockets);
  })
  allPlanets.forEach((currentPlanet) => {
    currentPlanet.update();
  })

  controls.update()

  cameraThirdPerson.update();

  
  renderer.render(scene, camera);
}

function init() {
  startRenderer()
}

const addStars = (numberOfStars) => {
  const middle = new p5.Vector(0, 0, 0);
  let outputTotal = 0;
  let locationValues = [];
  let vectorForDistanceComparison = new p5.Vector();
  let distanceFromMiddle;
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff });

  while (outputTotal < numberOfStars) {
    const star = new THREE.Mesh( geometry, material );
    locationValues = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 1000 ));
    vectorForDistanceComparison.set(locationValues[0], locationValues[1], locationValues[2]);
    distanceFromMiddle = threeDObject.distance(vectorForDistanceComparison, middle);

    //prevents star from rendering within the solar system.
    if (distanceFromMiddle > 150) {
      star.position.set(locationValues[0], locationValues[1], locationValues[2]);
      scene.add(star);
      outputTotal++;
    }
  }

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
  
  document.getElementById("numberOfRockets").innerHTML = allRockets.length;
}

const moveCamera = () => {
  camera.position.z += .1;
}

document.body.onscroll = moveCamera;

init();

