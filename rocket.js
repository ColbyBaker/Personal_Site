var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import p5 from 'p5';
import threeDObject from './threeDObject.js';
import * as THREE from 'three';

var Rocket = function (_threeDObject) {
    _inherits(Rocket, _threeDObject);

    function Rocket(initialPosition) {
        var flocking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var inAnimation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var initialVelocity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new THREE.Vector3();

        _classCallCheck(this, Rocket);

        var _this = _possibleConstructorReturn(this, (Rocket.__proto__ || Object.getPrototypeOf(Rocket)).call(this, initialPosition, inAnimation));

        _this._scale = new THREE.Vector3(.8, 1, .8);
        _this._scale.multiplyScalar(.6); //.6
        _this.fileName = 'rocket.glb';
        _this._model;

        _this._sceneMin = -700;
        _this._sceneMax = 700;

        _this._velocity = new THREE.Vector3(initialVelocity[0], initialVelocity[1], initialVelocity[2]);
        if (_this._velocity.x === 0 && _this._velocity.y === 0, _this._velocity.z === 0) {
            _this._velocity.random();
        }
        _this._velocity = _this.setMagnitude(_this._velocity, 1);
        _this._acceleration = new THREE.Vector3();
        _this.flocking = flocking;

        //both below are used for animation purposes.
        _this._lastPosition = new THREE.Vector3();
        _this._nextPosition = _this._position.clone();

        _this._perception = 20;
        _this._maxForce = .01;
        _this._maxSpeed = .8;

        _this._alignmentScalar = 1.7;
        _this._cohesionScalar = .5;
        _this._separationScalar = .2;

        document.getElementById("alignment").value = _this._alignmentScalar;
        document.getElementById("cohesion").value = _this._cohesionScalar;
        document.getElementById("separation").value = _this._separationScalar;

        document.getElementById("perception").value = _this._perception;
        document.getElementById("maxForce").value = _this._maxForce;
        document.getElementById("maxSpeed").value = _this._maxSpeed;
        return _this;
    }

    //returns an array of rocket objects within range of this._perception
    //todo simplify the returned objects to store only neccessary data for performance. Refactor distance to be a property of the simplified object as distance from this or something along those lines.


    _createClass(Rocket, [{
        key: '_getLocalRockets',
        value: function _getLocalRockets(allRockets) {
            var _this2 = this;

            var output = allRockets.filter(function (currentRocket, index) {
                var distance = threeDObject.distance(_this2.position, allRockets[index].position);
                if (distance === 0) {
                    return false;
                }
                return distance <= _this2._perception;
            });
            return output;
        }

        //steer towards the average heading of local rockets

    }, {
        key: '_alignment',
        value: function _alignment(localRockets) {
            var steerForce = new THREE.Vector3();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = localRockets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var other = _step.value;

                    steerForce.add(other.velocity);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            steerForce.divideScalar(localRockets.length);

            steerForce = this.setMagnitude(steerForce, 1);
            steerForce.sub(this.velocity);
            steerForce = this.limit(steerForce, this._maxForce);
            return steerForce;
        }

        //steer to move toward the average position of local rockets

    }, {
        key: '_cohesion',
        value: function _cohesion(localRockets) {
            var avg = new THREE.Vector3();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = localRockets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var other = _step2.value;

                    avg.add(other.position);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            avg.divideScalar(localRockets.length);
            var steerForce = avg.sub(this.position);
            steerForce = avg.sub(this.velocity);
            steerForce = this.setMagnitude(steerForce, this._maxSpeed);
            steerForce = this.limit(steerForce, this._maxForce);
            return steerForce;
        }

        //steer to avoid crowding local rockets

    }, {
        key: '_separation',
        value: function _separation(localRockets) {
            var avg = new THREE.Vector3();
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = localRockets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var other = _step3.value;

                    var distance = threeDObject.distance(this.position, other.position);
                    var diff = new THREE.Vector3(this.position);
                    diff.sub(other.position);

                    //reduces effect as distance increases
                    diff.divideScalar(distance * distance);

                    avg.add(diff);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            avg.divideScalar(localRockets.length);
            var steerForce = avg.sub(this.velocity);
            steerForce = this.setMagnitude(steerForce, this._maxSpeed);
            steerForce = this.limit(steerForce, this._maxForce);
            return steerForce;
        }

        //eventually this will allow them to actually avoid the scene walls, but for now they have some pretty solid warp drive tech.

    }, {
        key: '_aviodWalls',
        value: function _aviodWalls() {
            //make the rockets avoid walls idk
            if (this.position.x > this._sceneMax) {
                this._position.x = this._sceneMin;
            } else if (this.position.x < this._sceneMin) {
                this._position.x = this._sceneMax;
            }
            if (this.position.y > this._sceneMax) {
                this._position.y = this._sceneMin;
            } else if (this.position.y < this._sceneMin) {
                this._position.y = this._sceneMax;
            }
            if (this.position.z > this._sceneMax) {
                this._position.z = this._sceneMin;
            } else if (this.position.z < this._sceneMin) {
                this._position.z = this._sceneMax;
            }
        }

        //most of this was shamelessly copied.

    }, {
        key: '_pointForwards',
        value: function _pointForwards() {
            var m = new THREE.Matrix4();
            m.lookAt(new THREE.Vector3(0, 0, 0), this.velocity, new THREE.Vector3(0, 1, 0));
            this._model.quaternion.setFromRotationMatrix(m);
        }
    }, {
        key: '_flock',
        value: function _flock(allRocekts) {
            var localRockets = this._getLocalRockets(allRocekts);
            if (localRockets.length === 0) {
                return;
            }
            this._updateScalars();

            this._acceleration.add(this._alignment(localRockets).multiplyScalar(this._alignmentScalar));
            this._acceleration.add(this._cohesion(localRockets).multiplyScalar(this._cohesionScalar));
            this._acceleration.add(this._separation(localRockets).multiplyScalar(this._separationScalar));
        }

        //called once every threejs animation loop

    }, {
        key: 'update',
        value: function update(allRockets) {
            this._acceleration.multiplyScalar(0);
            if (!this.inAnimation) {
                this._flock(allRockets);
                this._position.add(this.limit(this._velocity, this._maxSpeed));
                this._velocity.add(this._acceleration);

                this._aviodWalls();
                this._pointForwards();
            } else if (this.inAnimation) {
                this._position.set(this._nextPosition.x, this._nextPosition.y, this._nextPosition.z);
                this._velocity = new THREE.Vector3(this._position.x - this._lastPosition.x, this._position.y - this._lastPosition.y, this._position.z - this._lastPosition.z);
                this._pointForwards();
                this._lastPosition.set(this.position.x, this.position.y, this.position.z);
            }
            this._model.position.set(this._position.x, this._position.y, this._position.z);
        }

        //todo add debug boolean so this can be skipped if the controls aren't in use.

    }, {
        key: '_updateScalars',
        value: function _updateScalars() {
            var alignmentValue = document.getElementById("alignment").value;
            alignmentValue = Math.round(alignmentValue * 100) / 100;
            if (alignmentValue != this._alignmentScalar) {
                console.log('Alignment: ' + alignmentValue);
            }
            this._alignmentScalar = alignmentValue;

            var cohesionValue = document.getElementById("cohesion").value;
            cohesionValue = Math.round(cohesionValue * 100) / 100;
            if (cohesionValue != this._cohesionScalar) {
                console.log('Cohesion: ' + cohesionValue);
            }
            this._cohesionScalar = cohesionValue;

            var separationValue = document.getElementById("separation").value;
            separationValue = Math.round(separationValue * 100) / 100;
            if (separationValue != this._separationScalar) {
                console.log('separation: ' + separationValue);
            }
            this._separationScalar = separationValue;

            var perceptionValue = document.getElementById("perception").value;
            perceptionValue = Math.round(perceptionValue * 100) / 100;
            if (perceptionValue != this._perception) {
                console.log('perception: ' + perceptionValue);
            }
            this._perception = perceptionValue;

            var maxForceValue = document.getElementById("maxForce").value;
            maxForceValue = Math.round(maxForceValue * 100) / 100;
            if (maxForceValue != this._maxForce) {
                console.log('maxForce: ' + maxForceValue);
            }
            this._maxForce = maxForceValue;

            var maxSpeedValue = document.getElementById("maxSpeed").value;
            maxSpeedValue = Math.round(maxSpeedValue * 100) / 100;
            if (maxSpeedValue != this._maxSpeed) {
                console.log('maxSpeed: ' + maxSpeedValue);
            }
            this._maxSpeed = maxSpeedValue;
        }
    }, {
        key: 'setMagnitude',
        value: function setMagnitude(threeVector, magnitude) {
            var output = new p5.Vector(threeVector.x, threeVector.y, threeVector.z);
            output.setMag(magnitude);
            return new THREE.Vector3(output.x, output.y, output.z);
        }
    }, {
        key: 'limit',
        value: function limit(threeVector, _limit) {
            var output = new p5.Vector(threeVector.x, threeVector.y, threeVector.z);
            output.limit(_limit);
            return new THREE.Vector3(output.x, output.y, output.z);
        }
    }, {
        key: 'asyncLoadModel',
        value: function asyncLoadModel() {
            var _this3 = this;

            return _get(Rocket.prototype.__proto__ || Object.getPrototypeOf(Rocket.prototype), 'asyncLoadModel', this).call(this, this.fileName, this._position, this._scale).then(function (model) {
                _this3._model = model;
                return model;
            });
        }
    }, {
        key: 'nextPosition',
        set: function set(newPosition) {
            this._nextPosition.set(newPosition.x, newPosition.y, newPosition.z);
        }
    }, {
        key: 'position',
        get: function get() {
            var output = new THREE.Vector3();
            output.copy(this._position);
            return output;
        },
        set: function set(newPosition) {
            this._position = newPosition;
        }
    }, {
        key: 'velocity',
        get: function get() {
            return this._velocity;
        }
    }, {
        key: 'model',
        get: function get() {
            return this._model;
        }
    }]);

    return Rocket;
}(threeDObject);

export default Rocket;