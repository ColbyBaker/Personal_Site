var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import * as THREE from 'three';
import p5 from 'p5';
import threeDObject from './threeDObject';

var CustomThirdPersonCamera = function () {
    function CustomThirdPersonCamera(camera) {
        _classCallCheck(this, CustomThirdPersonCamera);

        this._camera = camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
        this._target;

        this._offsetBeforeTransition = new THREE.Vector3();
        this._defaultOffset = new THREE.Vector3(0, -2, 17); //0, -2, 17
        this._offset = new THREE.Vector3();
        this._offset.copy(this._defaultOffset);
        this._lookAt = new THREE.Vector3(0, -4, 0); //0, -4, 0
    }

    _createClass(CustomThirdPersonCamera, [{
        key: 'update',
        value: function update() {
            var idealOffset = this._calculateIdealOffset();
            var idealLookat = this._calculateIdealLookAT();

            this._currentPosition.copy(idealOffset);
            this._currentLookat.copy(idealLookat);

            this._camera.position.copy(this._currentPosition);
            this._camera.lookAt(this._currentLookat);
        }
    }, {
        key: '_calculateIdealOffset',
        value: function _calculateIdealOffset() {
            var idealOffset = new THREE.Vector3(this._offset.x, this._offset.y, this._offset.z);
            idealOffset.add(this._target.position);
            return idealOffset;
        }
    }, {
        key: '_calculateIdealLookAT',
        value: function _calculateIdealLookAT() {
            var idealLookat = new THREE.Vector3(this._lookAt.x, this._lookAt.y, this._lookAt.z);
            idealLookat.x += this._target.position.x;
            idealLookat.y += this._target.position.y;
            idealLookat.z += this._target.position.z;
            return idealLookat;
        }
    }, {
        key: 'setTarget',
        value: function setTarget(target) {
            this._target = target;
        }
    }, {
        key: 'setOffsetToDefault',
        value: function setOffsetToDefault() {
            this._offset.copy(this._defaultOffset);
        }
    }, {
        key: 'offset',
        set: function set(newOffset) {
            this._offset.copy(newOffset);
        },
        get: function get() {
            return new THREE.Vector3(this._offset.x, this._offset.y, this._offset.z);
        }
    }, {
        key: 'defaultOffset',
        get: function get() {
            var output = new THREE.Vector3();
            output.copy(this._defaultOffset);
            return output;
        }
    }, {
        key: 'targetPosition',
        get: function get() {
            return new THREE.Vector3(this._target.position.x, this._target.position.y, this._target.position.z);
        }
    }, {
        key: 'offsetBeforeTransition',
        set: function set(newOffset) {
            this._offsetBeforeTransition.copy(newOffset);
        },
        get: function get() {
            return this._offsetBeforeTransition.clone();
        }
    }, {
        key: 'target',
        get: function get() {
            return this._target;
        }
    }, {
        key: 'radius',
        get: function get() {
            return threeDObject.distance(this._currentPosition, new THREE.Vector3(0, 0, 0));
        }
    }, {
        key: 'theta',
        get: function get() {
            var p = this._currentPosition;
            return Math.atan2(p.z, p.x);
        }
    }, {
        key: 'thetaRelativeToPlanet',
        get: function get() {
            return Math.atan2(this._offset.z, this._offset.x);
        }
    }, {
        key: 'position',
        get: function get() {
            return new THREE.Vector3(this._currentPosition.x, this._currentPosition.y, this._currentPosition.z);
        }
    }]);

    return CustomThirdPersonCamera;
}();

export default CustomThirdPersonCamera;