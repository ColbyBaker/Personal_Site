var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import p5 from 'p5';

var loader = new GLTFLoader();

var threeDObject = function () {
    function threeDObject(initialPosition) {
        var inAnimation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, threeDObject);

        this._position = new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2]);
        this._scale = new THREE.Vector3(1, 1, 1);

        this.inAnimation = inAnimation;
    }

    _createClass(threeDObject, [{
        key: 'asyncLoadModel',


        //http://localhost:5000
        value: function asyncLoadModel(fileName, position, scale) {
            var filePath = "/assets/" + fileName;
            return new Promise(function (resolve, reject) {
                loader.load(filePath, function (gltf) {
                    var model = gltf.scene;
                    model.scale.set(scale.x, scale.y, scale.z);
                    model.position.set(position.x, position.y, position.z);
                    resolve(model);
                }, undefined, function (error) {
                    console.error('An error happened while loading a glb', error);
                    reject(error);
                });
            });
        }
    }], [{
        key: 'distance',
        value: function distance(p1, p2) {
            var a = p2.x - p1.x;
            var b = p2.y - p1.y;
            var c = p2.z - p1.z;
            var distance = Math.hypot(a, b, c);
            //console.log(distance);

            return distance;
        }
    }]);

    return threeDObject;
}();

export default threeDObject;