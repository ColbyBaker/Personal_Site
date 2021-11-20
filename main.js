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

const init = () => {
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


  let sun;
  let mercury;
  let venus;
  let earth;
  let moon;
  let mars;
  let jupiter;
  let saturn;
  let uranus;
  let neptune;
  let pluto;

  // loader.load('/sun.glb', function ( gltf ) {
  //   sun = gltf.scene
  //   sun.scale.set(10, 10, 10)
  //   sun.position.set(0, 0, 0)
  //   scene.add(sun);
  // })

  // loader.load('/resources/mercury.glb', function ( gltf ) {
  //   mercury = gltf.scene
  //   mercury.scale.set(10, 10, 10)
  //   mercury.position.set(0, 14, 0)
  //   scene.add(mercury);
  // })

  // loader.load('/resources/venus.glb', function ( gltf ) {
  //   venus = gltf.scene
  //   venus.scale.set(10, 10, 10)
  //   venus.position.set(0, 22, 0)
  //   scene.add(venus);
  // })

  // loader.load('/resources/earth.glb', function ( gltf ) {
  //   earth = gltf.scene
  //   earth.scale.set(10, 10, 10)
  //   earth.position.set(0, 31, 0)
  //   scene.add(earth);
  // })

  // loader.load('/resources/moon.glb', function ( gltf ) {
  //   moon = gltf.scene
  //   moon.scale.set(10, 10, 10)
  //   moon.position.set(0, 34.5, 0)
  //   scene.add(moon);
  // })

  // loader.load('/resources/mars.glb', function ( gltf ) {
  //   mars = gltf.scene
  //   mars.scale.set(10, 10, 10)
  //   mars.position.set(0, 42, 0)
  //   scene.add(mars);
  // })

  // loader.load('/resources/jupiter.glb', function ( gltf ) {
  //   jupiter = gltf.scene
  //   jupiter.scale.set(10, 10, 10)
  //   jupiter.position.set(0, 55, 0)
  //   scene.add(jupiter);
  // })

  // loader.load('/resources/saturn.glb', function ( gltf ) {
  //   saturn = gltf.scene
  //   saturn.scale.set(10, 10, 10)
  //   saturn.position.set(0, 69, 0)
  //   saturn.rotateX(25)
  //   scene.add(saturn);
  // })

  // loader.load('./resources/uranus.glb', function ( gltf ) {
  //   uranus = gltf.scene
  //   uranus.scale.set(10, 10, 10)
  //   uranus.position.set(0, 81, 0)
  //   scene.add(uranus);
  // })

  // loader.load('/resources/neptune.glb', function ( gltf ) {
  //   neptune = gltf.scene
  //   neptune.scale.set(10, 10, 10)
  //   neptune.position.set(0, 91, 0)
  //   scene.add(neptune);
  // })

  // loader.load('/resources/pluto.glb', function ( gltf ) {
  //   pluto = gltf.scene
  //   pluto.scale.set(10, 10, 10)
  //   pluto.position.set(0, 102, 0)
  //   scene.add(pluto);
  // })



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

  animate();
}

var r = 10;
  var theta = 0;
  let mercuryTheta = 0;
  var mercuryDTheta = 2.2 * Math.PI / 1000;
  var dTheta = 2 * Math.PI / 1000;

function animate() {
  requestAnimationFrame(animate);

  // earth.rotation.y += .01;
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

function generate() {
  loader.load('/resources/rocketWithoutFlame.glb', function ( gltf ) {
      let rocket = gltf.scene;
      rocket.scale.set(10, 12, 10);
      rocket.position.set(0, 0, 0);
  })
}

init();
//generate();

let classRocket = new Rocket([20, 0, 0]);
classRocket.asyncLoadModel()
  .then(model => {
    console.table(model)
    scene.add(model);
  })

let classPlanetSun = new Planet([0, 0, 0], '/sun.glb');
classPlanetSun.asyncLoadModel()
  .then(model => {
    scene.add(model);
  })

