import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import threeDObject from './threeDObject';
import p5 from'p5';

export default class Planet extends threeDObject{
    constructor(initialPosition, filePath) {
        super(initialPosition);
        this.scale = new p5.Vector(10, 10, 10);
        this.filePath = filePath;
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.filePath, this.position, this.scale)
    }

}