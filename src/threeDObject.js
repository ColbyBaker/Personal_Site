import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import p5 from 'p5';

const loader = new GLTFLoader();

export default class threeDObject {
    constructor(initialPosition, inAnimation = false) {
        this._position = new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2]);
        this._scale = new THREE.Vector3(1, 1, 1);

        this.inAnimation = inAnimation;
    }

    static rocketModel;

    static distance(p1, p2) {
        var a = p2.x - p1.x;
        var b = p2.y - p1.y;
        var c = p2.z - p1.z;
        const distance = Math.hypot(a, b, c);
        //console.log(distance);

        return distance;
    }

    static loadRocketModel() {
        const filePath = "/assets/models/" + 'rocket.glb';
        return new Promise((resolve, reject) => {
            loader.load(filePath, (gltf) => {
                let model = gltf.scene;
                resolve(model);
            },

            undefined,

            error => {
                console.error('An error happened while loading a glb', error);
                reject(error);
            })
        })
            .then((model) => {
                this.rocketModel = model;
                return model;
            })
    }

    static getRocketModel(position, scale) {
        let model = this.rocketModel.clone();
        model.scale.set(scale.x, scale.y, scale.z);
        model.position.set(position.x, position.y, position.z);
        return model;
    }

    //http://localhost:5000
    asyncLoadModel(fileName, position, scale) {
        const filePath = "/assets/models/" + fileName;
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