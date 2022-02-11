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

var camera = void 0,
    scene = void 0,
    renderer = void 0,
    loader = void 0;
var thirdPersonCamera = void 0,
    Animations = void 0;
var controls = void 0,
    clock = void 0,
    stats = void 0;
var spotlight = void 0,
    spotlight2 = void 0,
    spotlight3 = void 0,
    spotlight4 = void 0,
    spotlight5 = void 0,
    spotlight6 = void 0;
var launchRocket = function launchRocket() {};

var inputRockets = 0;
document.getElementById("addRocket").addEventListener("click", function () {
  inputRockets = document.getElementById("inputNumberRockets").value;
  for (var x = 0; x < inputRockets; x++) {
    addRocket();
  }
});

javascript: (function () {
  var script = document.createElement('script');script.onload = function () {
    var stats = new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop() {
      stats.update();requestAnimationFrame(loop);
    });
  };script.src = '//cdn.jsdelivr.net/gh/Kevnz/stats.js/build/stats.min.js';document.head.appendChild(script);
})();

var sun = new Planet(0, 'sun.glb', 1000, 0);
var mercury = new Planet(65, 'mercury.glb', 241, 0.73);
var venus = new Planet(100, 'venus.glb', 615, 4.4);
var earth = new Planet(155, 'earth.glb', 1000, 5.4);
var moon = new Moon(155, 'moon.glb', 1000, 5.4, 8, 1700, -1);
var mars = new Planet(210, 'mars.glb', 1880, -1.945);
var jupiter = new Planet(275, 'jupiter.glb', 11900, 3.85);
var saturn = new Planet(345, 'saturn.glb', 29400, -3.82);
var uranus = new Planet(405, 'uranus.glb', 83700, 0.79);
var neptune = new Planet(455, 'neptune.glb', 163700, 4.76);
var pluto = new Planet(510, 'pluto.glb', 247900, -4.57);
//You heard about Pluto? That's messed up right?

document.getElementById("launch-home").addEventListener("click", function () {
  launchRocket(earth);
});
document.getElementById("launch-projects").addEventListener("click", function () {
  launchRocket(mars);
});
document.getElementById("launch-about-me").addEventListener("click", function () {
  launchRocket(saturn);
});
document.getElementById("launch-resume").addEventListener("click", function () {
  githubAPI.repo("jamming").then(function (data) {
    console.log(data);
  });
  //launchRocket(jupiter);
});

var spotlightDistance = 30;
var spotlightAngle = .8;
var spotlightPenumbra = 0.1;
var spotlightIntensity = 2;
var spotlightDecay = 0.1;
spotlight = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight2 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight3 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight4 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight5 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight6 = new THREE.SpotLight(0xffffff, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
spotlight.position.set(0, 35, 0);
spotlight2.position.set(0, -35, 0);
spotlight3.position.set(35, 0, 0);
spotlight4.position.set(-35, 0, 0);
spotlight5.position.set(0, 0, 35);
spotlight6.position.set(0, 0, -35);

var allPlanets = [sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, pluto];
var allRockets = [];

var loadPlanetModels = function loadPlanetModels() {
  var planetPromises = allPlanets.map(function (currentPlanet) {
    return currentPlanet.asyncLoadModel();
  });

  return Promise.all(planetPromises).then(function () {
    allPlanets.forEach(function (currentPlanet) {
      scene.add(currentPlanet.model);
    });
  });
};

var startRenderer = function startRenderer() {
  loader = new GLTFLoader();
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
  });

  var fov = 75;
  var aspect = window.innerWidth / window.innerHeight;
  var near = 0.1;
  var far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-5, 27.5, -1.7);
  thirdPersonCamera = new CustomThirdPersonCamera(camera);

  clock = new THREE.Clock();
  Animations = new AnimationEngine(scene, thirdPersonCamera);

  renderer.setPixelRatio(window.devicePixeRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  controls = new OrbitControls(camera, renderer.domElement);

  var pointLight = new THREE.PointLight(0xffffff, 1.3);
  var ambientLight = new THREE.AmbientLight(0xffffff, .3);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight, ambientLight);
  var lightHelper = new THREE.SpotLightHelper(spotlight5);
  var gridHelper = new THREE.GridHelper(200, 20);
  //scene.add(gridHelper)

  scene.add(spotlight, spotlight2, spotlight3, spotlight4, spotlight5, spotlight6);

  loadPlanetModels();

  launchRocket = function launchRocket(destination) {
    var planetPosition = thirdPersonCamera.targetPosition;
    var newRocket = new Rocket([planetPosition.x, planetPosition.y, planetPosition.z], false, true);
    newRocket.asyncLoadModel().then(function (model) {
      scene.add(model);
      allRockets.push(newRocket);
      Animations.launchRocket(newRocket, destination);
    });
  };

  var initialNumberOfRockets = 1;
  for (var x = 0; x < initialNumberOfRockets; x++) {
    addRocket();
  }

  addStars(9000);
  thirdPersonCamera.setTarget(earth);

  window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  animate();
};

function animate() {
  requestAnimationFrame(animate);

  allRockets.forEach(function (currentRocket) {
    currentRocket.update(allRockets);
  });
  allPlanets.forEach(function (currentPlanet) {
    currentPlanet.update();
  });

  Animations.update();

  controls.update();

  thirdPersonCamera.update();

  renderer.render(scene, camera);
}

function init() {
  startRenderer();
}

var addStars = function addStars(numberOfStars) {
  var middle = new p5.Vector(0, 0, 0);
  var outputTotal = 0;
  var locationValues = [];
  var vectorForDistanceComparison = new p5.Vector();
  var distanceFromMiddle = void 0;
  var geometry = new THREE.SphereGeometry(0.25, 24, 24);
  var material = new THREE.MeshStandardMaterial({ color: 0xffffff });

  while (outputTotal < numberOfStars) {
    var star = new THREE.Mesh(geometry, material);
    locationValues = Array(3).fill().map(function () {
      return THREE.MathUtils.randFloatSpread(1000);
    });
    vectorForDistanceComparison.set(locationValues[0], locationValues[1], locationValues[2]);
    distanceFromMiddle = threeDObject.distance(vectorForDistanceComparison, middle);

    //prevents star from rendering within the solar system.
    if (distanceFromMiddle > 400) {
      star.position.set(locationValues[0], locationValues[1], locationValues[2]);
      scene.add(star);
      outputTotal++;
    }
  }
};

var addRocket = function addRocket() {
  var min = -20;
  var max = 20;
  var initialX = Math.round(Math.random() * (max - min) + min);
  var initialY = Math.round(Math.random() * (max - min) + min);
  var initialZ = Math.round(Math.random() * (max - min) + min);
  var initialPosition = [initialX, initialY, initialZ];

  var newRocket = new Rocket(initialPosition);
  allRockets.push(newRocket);
  newRocket.asyncLoadModel().then(function (model) {
    scene.add(model);
  });

  document.getElementById("numberOfRockets").innerHTML = allRockets.length;
};

init();