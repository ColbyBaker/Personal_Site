import '/style.css';
import * as THREE from 'three';
import p5 from 'p5';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import Rocket from './rocket';
import Planet from './planet';
import Moon from './moon';
import threeDObject from './threeDObject';
import CustomThirdPersonCamera from './CustomThirdPersonCamera';
import AnimationEngine from './AnimationEngine';

let loading = true;
let camera, scene, renderer, loader;
let thirdPersonCamera, Animations;
let controls, clock, stats;
let spotlight, spotlight2, spotlight3, spotlight4, spotlight5, spotlight6;
let launchRocket = () => {}

let inputRockets = 0;
document.getElementById("addRocket").addEventListener("click", () => {
  inputRockets = document.getElementById("inputNumberRockets").value;
  for (let x = 0; x < inputRockets; x++) {
    addRocket();
  }
})

//FPS counter
//javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//cdn.jsdelivr.net/gh/Kevnz/stats.js/build/stats.min.js';document.head.appendChild(script);})()

let sun = new Planet(0, 'sun.glb', 1000, 0);
let mercury = new Planet(65, 'mercury.glb', 241, 0.73);
let venus = new Planet(100, 'venus.glb', 615, 4.4);
let earth = new Planet(155, 'earth.glb', 1000, 5.4);
let moon = new Moon(155, 'moon.glb', 1000, 5.4, 8, 1700, -1);
let mars = new Planet(210, 'mars.glb', 1880, -1.9);
let jupiter = new Planet(275, 'jupiter.glb', 11900, 3.85);
let saturn = new Planet(345, 'saturn.glb', 29400, -3.82);
let uranus = new Planet(405, 'uranus.glb', 83700, 0.79);
let neptune = new Planet(455, 'neptune.glb', 163700, 4.76);
let pluto = new Planet(510, 'pluto.glb', 247900, -4.57);
//You heard about Pluto? That's messed up right?

document.getElementById("launch-home").addEventListener("click", () => {
  launchRocket(earth);
})
document.getElementById("launch-projects").addEventListener("click", () => {
  launchRocket(mars);
})
document.getElementById("launch-about-me").addEventListener("click", () => {
  launchRocket(saturn);
})
document.getElementById("launch-resume").addEventListener("click", () => {
  launchRocket(jupiter);
})

const spotlightDistance = 30;
const spotlightAngle = .8;
const spotlightPenumbra = 0.1;
const spotlightIntensity = 2;
const spotlightDecay = 0.1;
spotlight = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight2 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight3 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight4 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight5 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight6 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight.position.set(0, 35, 0)
spotlight2.position.set(0, -35, 0)
spotlight3.position.set(35, 0, 0)
spotlight4.position.set(-35, 0, 0)
spotlight5.position.set(0, 0, 35)
spotlight6.position.set(0, 0, -35)


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
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-5, 27.5, -1.7);
  thirdPersonCamera = new CustomThirdPersonCamera(camera);

  clock = new THREE.Clock();
  Animations = new AnimationEngine(scene, thirdPersonCamera);
  

  renderer.setPixelRatio(window.devicePixeRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  controls = new OrbitControls(camera, renderer.domElement)

  const pointLight = new THREE.PointLight(0xffffff, 1.3);
  const ambientLight = new THREE.AmbientLight(0xffffff, .3);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight, ambientLight);
  const lightHelper = new THREE.SpotLightHelper(spotlight5);
  const gridHelper = new THREE.GridHelper(200, 20)
  //scene.add(gridHelper)

  scene.add(spotlight, spotlight2, spotlight3, spotlight4, spotlight5, spotlight6)

  loadPlanetModels();

  launchRocket = (destination) => {
    const planetPosition = thirdPersonCamera.targetPosition;
    const newRocket = new Rocket([planetPosition.x, planetPosition.y, planetPosition.z], false, true);
    newRocket.asyncLoadModel()
      .then(model => {
        scene.add(model);
        allRockets.push(newRocket);
        Animations.launchRocket(newRocket, destination);
      })
  }

  const initialNumberOfRockets = 1;
  for (let x = 0; x < initialNumberOfRockets; x++) {
    addRocket();
  }

  addStars(9000);
  thirdPersonCamera.setTarget(earth);

  window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

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

  Animations.update();
  controls.update()
  thirdPersonCamera.update();
  renderer.render(scene, camera);
  if (loading) {
    document.querySelector("#loading-screen").style.display = "none";
    loading = false;
  }
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
    if (distanceFromMiddle > 400) {
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



init();

