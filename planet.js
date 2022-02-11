var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import threeDObject from './threeDObject';
import p5 from 'p5';
import { MathUtils } from 'three';
import * as THREE from 'three';

var Planet = function (_threeDObject) {
    _inherits(Planet, _threeDObject);

    function Planet(radiusFromSun, fileName, stepRate, initialTheta) {
        _classCallCheck(this, Planet);

        var _this = _possibleConstructorReturn(this, (Planet.__proto__ || Object.getPrototypeOf(Planet)).call(this, [0, 0, 0]));

        _this._radius = radiusFromSun * .5;
        _this._theta = initialTheta;
        _this._deltaTheta = 2 * Math.PI / stepRate * .01;
        //.5
        //stepRate * X modifies the speed, but keeps the ratios the same because that is ~extremely important and necessary~

        _this._scale.multiplyScalar(30);
        _this.fileName = fileName;
        _this._isLoading = true;
        _this._model;
        return _this;
    }

    _createClass(Planet, [{
        key: 'rotate',
        value: function rotate() {
            this._model.rotation.y += .002;
        }
    }, {
        key: 'orbit',
        value: function orbit() {
            //todo reset theta after one whole rotation;
            this._theta += this._deltaTheta;
            this._position.x = this._radius * Math.cos(this._theta);
            this._position.z = this._radius * Math.sin(this._theta);
        }
    }, {
        key: 'update',
        value: function update() {
            this.rotate();
            this.orbit();
            this._model.position.set(this._position.x, this._position.y, this._position.z);
        }
    }, {
        key: 'asyncLoadModel',
        value: function asyncLoadModel() {
            var _this2 = this;

            return _get(Planet.prototype.__proto__ || Object.getPrototypeOf(Planet.prototype), 'asyncLoadModel', this).call(this, this.fileName, [0, 0, 0], this._scale).then(function (model) {
                // if (this.fileName === 'saturn.glb') {
                //     model.rotation.x = 6;
                //     model.rotation.z = .2
                // }
                model.rotation.y = 90;
                _this2._model = model;
                return model;
            }).then(this._isLoading = false);
        }
    }, {
        key: 'model',
        get: function get() {
            return this._model;
        }
    }, {
        key: 'position',
        get: function get() {
            var output = new THREE.Vector3();
            output.copy(this._position);
            return output;
        }
    }, {
        key: 'deltaTheta',
        get: function get() {
            return this._deltaTheta;
        }
    }, {
        key: 'theta',
        get: function get() {
            var p = this._position;
            return Math.atan2(p.z, p.x);
        },
        set: function set(newThetaValue) {
            this._theta = newThetaValue;
        }
    }, {
        key: 'radius',
        get: function get() {
            return this._radius;
        }
    }]);

    return Planet;
}(threeDObject);

export default Planet;