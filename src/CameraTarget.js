import threeDObject from './threeDObject.js'
import * as THREE from 'three';

export default class CameraTarget extends threeDObject {
    constructor(initialPosition, inAnimation = true) {
        super(initialPosition, inAnimation);
    }

    set position(newPosition) {
        this._position.copy(newPosition);
    }

    get position() {
        let output = new THREE.Vector3();
        output.copy(this._position);
        return output;
    }
}