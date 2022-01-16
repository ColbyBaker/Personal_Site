import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import p5 from 'p5';

const loader = new GLTFLoader();

export default class threeDObject {
    constructor(initialPosition) {
        this._position = new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2]);
        this._scale = new THREE.Vector3(1, 1, 1);
    }

    static distance(p1, p2) {
        var a = p2.x - p1.x;
        var b = p2.y - p1.y;
        var c = p2.z - p1.z;
        const distance = Math.hypot(a, b, c);
        //console.log(distance);

        return distance;
    }

    asyncLoadModel(fileName, position, scale) {
        const filePath = "/resources/" + fileName;
        return new Promise((resolve, reject) => {
            loader.load(filePath, (gltf) => {
                let model = gltf.scene;
                model.scale.set(scale.x, scale.y, scale.z);
                model.position.set(position.x, position.y, position.z);
                resolve(model);
            },

            undefined,

            error => {
                console.error('An error happened while loading a glb', error);
                reject(error);
            })
        })
    }
}