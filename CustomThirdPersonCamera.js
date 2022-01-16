import * as THREE from 'three';
import p5 from 'p5';
import threeDObject from './threeDObject';

export default class CustomThirdPersonCamera {
    constructor(camera) {
        this._camera = camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
        this._target;

        this._offset = new THREE.Vector3(0, -2, 17);//0, -2, 17
        this._lookAt = new THREE.Vector3(0, -4, 0);
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
        let idealOffset = new THREE.Vector3(this._offset.x, this._offset.y, this._offset.z);
        idealOffset.add(this._target.position);
        return idealOffset;
    }

    _calculateIdealLookAT() {
        let idealLookat = new THREE.Vector3(this._lookAt.x, this._lookAt.y, this._lookAt.z);
        idealLookat.x += this._target.position.x;
        idealLookat.z += this._target.position.z;
        return idealLookat;
    }

    setTarget(target) {
        this._target = target;
    }

    get targetPosition() {
        return new THREE.Vector3(this._target.position.x, this._target.position.y, this._target.position.z);
    }

    get target() {
        return this._target;
    }

    get radius() {
        return threeDObject.distance(this._currentPosition, new THREE.Vector3(0, 0, 0));
    }

    get theta() {
        const p = this._currentPosition;
        return Math.atan2(p.z, p.x)
    }

    get thetaRelativeToPlanet() {
        return Math.atan2(this._offset.z, this._offset.x);
    }

    get position() {
        return new THREE.Vector3(this._currentPosition.x, this._currentPosition.y, this._currentPosition.z);
    }
}