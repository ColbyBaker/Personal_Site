import { Vector3 } from 'three';
import Planet from './planet';

export default class OrbitalTarget extends Planet {
    constructor(radiusFromSun, stepRate, initialTheta) {
        super(radiusFromSun, '', stepRate, initialTheta);
    }

    update() {
        this.orbit();
        this._position.set(this._position.x, this._position.y, this._position.z)
    }

    orbit() {
        super.orbit();
        //this._position.y += 30;
    }

    asyncLoadModel() {

    }
}