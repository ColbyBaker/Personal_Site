import * as THREE from 'three';
import p5 from 'p5';

export default class thirdPersonCamera {
    constructor(camera) {
        this._camera = camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
        this._target;
    }

    update() {
        const idealOffset = this._calculateIdealOffset();
        const idealLookat = this._calculateIdealLookAT();

        this._currentPosition.copy(idealOffset);
        this._currentLookat.copy(idealLookat);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }

    _calculateIdealOffset() {
        let idealOffset = new THREE.Vector3(0, -2, 17);
        idealOffset.add(this._target.position);
        return idealOffset;
    }

    _calculateIdealLookAT() {
        let idealLookat = new THREE.Vector3(0, -4, 0);
        //idealLookat.add(this._target.position);
        idealLookat.x += this._target.position.x;
        //idealLookat.y += this._target.position.y;
        idealLookat.z += this._target.position.z;
        return idealLookat;
    }

    setTarget(target) {
        this._target = target;
    }

    // _orbit() {
    //     console.log(this._currentPosition)
    //     this._theta += this._deltaTheta;
    //     this._currentPosition.x = this._radius * Math.cos(this._theta);
    //     this._currentPosition.z = this._radius * Math.sin(this._theta);

    //     this._camera.position.copy(this._currentPosition);
    // }

}