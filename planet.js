import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import threeDObject from './threeDObject';
import p5 from'p5';
import {MathUtils} from 'three';

export default class Planet extends threeDObject{
    constructor(radiusFromSun, fileName, stepRate = 1000) {
        super([0, 0, 0]);
        this._radius = radiusFromSun;
        this._theta = MathUtils.randFloatSpread(10);
        this._deltaTheta = 2 * Math.PI / stepRate * .01;
        //.5
        //stepRate * X modifies the speed, but keeps the ratios the same because that is ~extremely important and necessary~

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

    set theta(newThetaValue) {
        this._theta = newThetaValue;
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.fileName, [0, 0, 0], this._scale)
            .then(model => {
                model.rotation.y = 90;
                this._model = model;
                return model;
            })
            .then(this._isLoading = false);
    }
}