import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import threeDObject from './threeDObject';
import p5 from'p5';

export default class Planet extends threeDObject{
    constructor(initialPosition, fileName) {
        super(initialPosition);
        this._scale = new p5.Vector(10, 10, 10);
        this.fileName = fileName;
        this._isLoading = true;
        this.model;
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.fileName, this._position, this._scale)
            .then(model => {
                this.model = model;
                return model;
            })
            .then(this._isLoading = false);
    }
}