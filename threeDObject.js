import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import p5 from 'p5';

const loader = new GLTFLoader();

export default class threeDObject {
    constructor(initialPosition) {
        this.position = new p5.Vector(initialPosition[0], initialPosition[1], initialPosition[2]);
        this.scale = new p5.Vector(1, 1, 1);
    }

    asyncLoadModel(filePath, position, scale) {
        //console.log(position)
        return new Promise((resolve, reject) => {
            loader.load(filePath, (gltf) => {
                let model = gltf.scene;
                model.scale.set(scale.x, scale.y, scale.z);
                model.position.set(position.x, position.y, position.z);
                resolve(model);
            },

            undefined,

            error => {
                console.error('An error happened while loading a rocket glb', error);
                reject(error);
            })
        })
    }
}