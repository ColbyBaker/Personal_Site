import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SphereGeometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixeRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// const spaceTexture = new THREE.TextureLoader().load('./resources/bg.jpg');
// scene.background = spaceTexture;

let earth;
let moon;

loader.load('./resources/earth.glb', function ( gltf ) {
  earth = gltf.scene
  scene.add(earth);
})

loader.load('./resources/moon.glb', function ( gltf ) {
  moon = gltf.scene
  moon.position.set(0, .25, 0)
  scene.add(moon);
})



const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(8, 8, 8);
scene.add(pointLight, ambientLight);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


var r = .25;
var theta = 0;
var dTheta = 2 * Math.PI / 1000;

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += .01;

  theta += dTheta;
  moon.position.x = r * Math.cos(theta);
  moon.position.y = r * Math.sin(theta);
  moon.rotation.x += .005;


  controls.update();

  renderer.render(scene, camera);
}

animate();