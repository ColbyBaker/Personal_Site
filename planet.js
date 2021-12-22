import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import threeDObject from './threeDObject';
import p5 from'p5';

export default class Planet extends threeDObject{
    constructor(initialPosition, fileName, stepRate = 1000) {
        super(initialPosition);
        this._radius = initialPosition[2] * 2.5;
        this._theta = 0;
        this._deltaTheta = 2 * Math.PI / stepRate * .1;

        this._scale.mult(30);
        this.fileName = fileName;
        this._isLoading = true;
        this._model;
    }

    rotate() {
        this._model.rotation.y += .002;
    }

    orbit() {
        //todo reset theta after one whole rotation;
        this._theta += this._deltaTheta;
        this._position.x = this._radius * Math.cos(this._theta);
        this._position.z = this._radius * Math.sin(this._theta);
    }

    update() {
        this.rotate();
        this.orbit();
        this._model.position.set(this._position.x, this._position.y, this._position.z)
    }

    get model() {
        return this._model;
    }

    get position() {
        return this._position;
    }

    get deltaTheta() {
        return this._deltaTheta;
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.fileName, this._position, this._scale)
            .then(model => {
                model.rotation.y = 90;
                this._model = model;
                return model;
            })
            .then(this._isLoading = false);
    }
}