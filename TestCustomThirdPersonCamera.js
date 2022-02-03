import * as THREE from 'three';
import threeDObject from './threeDObject';
import CustomThirdPersonCamera from './CustomThirdPersonCamera';

export default class TestCustomThirdPersonCamera extends CustomThirdPersonCamera {
    constructor(camera) {
        super(camera);
    }

    update() {
        const idealOffset = this._calculateIdealOffset();
        const idealLookat = this._calculateIdealLookAT();

        this._currentPosition.copy(idealOffset);
        this._currentLookat.copy(idealLookat);
    }
}