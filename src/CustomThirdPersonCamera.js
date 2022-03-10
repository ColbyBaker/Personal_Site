import * as THREE from 'three';
import p5 from 'p5';
import threeDObject from './threeDObject';

export default class CustomThirdPersonCamera {
    constructor(camera) {
        this._camera = camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
        this._target;

        this._offsetBeforeTransition = new THREE.Vector3();
        this._defaultOffset = new THREE.Vector3(0, -2, 17);//0, -2, 17 | 0, -2, 14
        this._offset = new THREE.Vector3();
        this._offset.copy(this._defaultOffset);
        this._saturnOffsetModifier = new THREE.Vector3(30, 4, 8);// (30, 4, 8

        this._defaultLookAt = new THREE.Vector3(0, -4, 0);//0, -4, 0
        this._lookAt = new THREE.Vector3();
        this._lookAt.copy(this._defaultLookAt);
        this._saturnLookAtModifier = new THREE.Vector3(0, -12, 0); //0, -8, 0

        this._onMobile = false;

        this._mobileOffsetBias = 1;
        this._mobileLookAtBias = 2;

    }

    update() {
        if (window.innerHeight < 600 || window.innerWidth < 600) {
            this._onMobile = true;
        } else {
            this._onMobile = false;
        }
        const idealOffset = this._calculateIdealOffset();
        const idealLookat = this._calculateIdealLookAT();

        this._currentPosition.copy(idealOffset);
        this._currentLookat.copy(idealLookat);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }

    _calculateIdealOffset() {
        let idealOffset = new THREE.Vector3(this._offset.x, this._offset.y, this._offset.z);
        if (this._target.fileName === "saturn.glb") {
            idealOffset.add(this._saturnOffsetModifier);
        } 
        if (this._onMobile) {
            idealOffset.multiplyScalar(this._mobileOffsetBias);
        }
        idealOffset.add(this._target.position);
        return idealOffset;
    }

    _calculateIdealLookAT() {
        let idealLookat = new THREE.Vector3(this._lookAt.x, this._lookAt.y, this._lookAt.z);
        if (this._target.fileName === "saturn.glb") {
            idealLookat.add(this._saturnLookAtModifier);
        }
        if (this._onMobile) {
            idealLookat.multiplyScalar(this._mobileLookAtBias);
        }
        idealLookat.x += this._target.position.x;
        idealLookat.y += this._target.position.y;
        idealLookat.z += this._target.position.z;
        return idealLookat;
    }

    setTarget(target) {
        this._target = target;
    }

    setOffsetToDefault() {
        this._offset.copy(this._defaultOffset);
    }

    set offset(newOffset) {
        this._offset.copy(newOffset);
    }

    get defaultOffset() {
        const output = new THREE.Vector3();
        output.copy(this._defaultOffset);
        return output;
    }

    get targetPosition() {
        return new THREE.Vector3(this._target.position.x, this._target.position.y, this._target.position.z);
    }

    set offsetBeforeTransition(newOffset) {
        this._offsetBeforeTransition.copy(newOffset);
    }

    get offsetBeforeTransition() {
        return this._offsetBeforeTransition.clone();
    }

    get target() {
        return this._target;
    }

    get offset() {
        return new THREE.Vector3(this._offset.x, this._offset.y, this._offset.z);
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