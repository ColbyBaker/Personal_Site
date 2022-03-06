import '/style.css';
import * as THREE from 'three';
import p5 from 'p5';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import Rocket from './rocket';
import Planet from './planet';
import OrbitalTarget from './OrbitalTarget';
import Moon from './moon';
import threeDObject from './threeDObject';
import CustomThirdPersonCamera from './CustomThirdPersonCamera';
import AnimationEngine from './AnimationEngine';

let loading = true;
let checkingNavBar = false;
let camera, scene, renderer, loader;
let thirdPersonCamera, Animations;
let controls, clock, stats;
let spotlight, spotlight2, spotlight3, spotlight4, spotlight5, spotlight6;
let launchRocket = () => {};
let launchNewRocketToOrbit = () => {};
let moveRocket = () => {};
let launchRocketsOverTime = () => {};

let inputRockets = 0;
document.getElementById("addRocket").addEventListener("click", () => {
  const numberOfRockets = document.getElementById("inputNumberRockets").value;
  launchRocketsOverTime(numberOfRockets)
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
let orbitalTarget = new OrbitalTarget(520, 4000, 1);

let currentTarget;
let launchHomeButton = document.getElementById("launch-home");
launchHomeButton.addEventListener("click", () => {
  currentTarget === "#resume" ? moveRocket(earth) : launchRocket(earth);
  currentTarget = "#home";
});
let launchProjectsButton = document.getElementById("launch-projects");
launchProjectsButton.addEventListener("click", () => {
  currentTarget === "#resume" ? moveRocket(mars) : launchRocket(mars);
  currentTarget = "#projects";
})
let launchAboutMeButton = document.getElementById("launch-about-me");
launchAboutMeButton.addEventListener("click", () => {
  currentTarget === "#resume" ? moveRocket(saturn) : launchRocket(saturn);
  currentTarget = "#about-me";
})
let launchResumeButton = document.getElementById("launch-resume");
launchResumeButton.addEventListener("click", () => {
  launchNewRocketToOrbit();
  currentTarget = "#resume";
});
const navbarButtons = [launchHomeButton, launchProjectsButton, launchAboutMeButton, launchResumeButton];

navbarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("pushed");

    document.getElementById("home").classList.add('hidden');
    document.getElementById("projects").classList.add('hidden');
    document.getElementById("about-me").classList.add('hidden');
    document.getElementById("resume").classList.add('hidden');

    setTimeout(() => {checkingNavBar = true}, 100);

    navbarButtons.forEach((currentButton => {
      if (button === currentButton) {
        return;
      }
      currentButton.classList.remove("pushed");
      currentButton.classList.add("other-active");
    }))

  })
});

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


const allPlanets = [sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, pluto, orbitalTarget];
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

  let lastRocket;
  launchRocket = (destination) => {
    const planetPosition = thirdPersonCamera.targetPosition;
    const newRocket = new Rocket([planetPosition.x, planetPosition.y, planetPosition.z], false, true);
    lastRocket = newRocket;
    scene.add(newRocket.getRocketModel());
    allRockets.push(newRocket);
    Animations.launchNewRocketToPlanet(newRocket, destination);
  }


  launchNewRocketToOrbit = () => {
    const planetPosition = thirdPersonCamera.targetPosition;
    const newRocket = new Rocket([planetPosition.x, planetPosition.y, planetPosition.z], false, true);
    lastRocket = newRocket;
    scene.add(newRocket.getRocketModel());
    allRockets.push(newRocket);
    Animations.launchNewRocketToOrbit(newRocket);
  }

  moveRocket = (destination) => {
    Animations.moveRocketToPlanet(lastRocket, destination);
  }
  launchRocketsOverTime = (numberOfRockets) => {
    for (let x = 0; x < numberOfRockets; x++) {
      setTimeout(() => {addRocket()}, x * 100)
    }
  }
  //initial number of rockets
  launchRocketsOverTime(50);

  addStars(9000);
  thirdPersonCamera.setTarget(earth);

  window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  setTimeout(animate, 150);
  document.querySelector('#home').scrollIntoView({
    behavior: 'smooth'
  });
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

  if (checkingNavBar && !Animations.inNavbarAnimation) {
    document.querySelector(currentTarget).classList.remove('hidden');
    navbarButtons.forEach(currentButton => {
      currentButton.classList.remove("other-active");
    });
    checkingNavBar = false;
  }

}

function init() {
  threeDObject.loadRocketModel()
    .then(() => {
      startRenderer();
    });
}

const addStars = (numberOfStars) => {
  const middle = new p5.Vector(0, 0, 0);
  let outputTotal = 0;
  let locationValues = [];
  let vectorForDistanceComparison = new p5.Vector();
  let distanceFromMiddle;

  while (outputTotal < numberOfStars) {
    const starRadius = THREE.MathUtils.randFloat(0.25, 0.5);
    const geometry = new THREE.SphereGeometry(starRadius, 24, 24); //(0.25)
    const material = new THREE.MeshStandardMaterial( {color: 0xffffff });
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
  let launchPlanet = allPlanets[THREE.MathUtils.randInt(0, allPlanets.length - 1)];
  while(launchPlanet === earth || launchPlanet === moon) {
    launchPlanet = allPlanets[THREE.MathUtils.randInt(0, allPlanets.length - 1)];
  }
  const initialPosition = launchPlanet.position;

  const newRocket = new Rocket([initialPosition.x, initialPosition.y, initialPosition.z]);
  allRockets.push(newRocket);
  scene.add(newRocket.getRocketModel());
  //Animations.launchBackgroundRocket(newRocket, launchPlanet);
  
  document.getElementById("numberOfRockets").innerHTML = allRockets.length;
}



init();

