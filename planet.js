import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import threeDObject from './threeDObject';
import p5 from'p5';
import {MathUtils} from 'three';

export default class Planet extends threeDObject{
    constructor(radiusFromSun, fileName, stepRate, initialTheta) {
        super([0, 0, 0]);
        this._radius = radiusFromSun * .5;
        this._theta = initialTheta;
        this._deltaTheta = 2 * Math.PI / stepRate * .01;
        //.5
        //stepRate * X modifies the speed, but keeps the ratios the same because that is ~extremely important and necessary~

        this._scale.multiplyScalar(30);
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

    get theta() {
        const p = this._position;
        return Math.atan2(p.z, p.x);
    }

    get radius() {
        return this._radius;
    }

    set theta(newThetaValue) {
        this._theta = newThetaValue;
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.fileName, [0, 0, 0], this._scale)
            .then(model => {
                // if (this.fileName === 'saturn.glb') {
                //     model.rotation.x = 6;
                //     model.rotation.z = .2
                // }
                model.rotation.y = 90;
                this._model = model;
                return model;
            })
            .then(this._isLoading = false);
    }
}