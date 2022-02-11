var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import * as THREE from 'three';

var AnimationEngine = function () {
    function AnimationEngine(scene, thirdPersonCamera) {
        _classCallCheck(this, AnimationEngine);

        this._scene = scene;
        this._thirdPersonCamera = thirdPersonCamera;

        this.inAnimation = false;

        this._animatedObjectsArray = [];
        //see bottom of file for an example of _currentAnimations during operation.
        this._currentAnimations = [];
        this._animationQueue = [];
        this._usedSequenceIDs = [];
    }

    _createClass(AnimationEngine, [{
        key: 'update',
        value: function update() {
            if (this.inAnimation) {
                this._handleAllCurrentAnimations();
            }
        }
    }, {
        key: '_handleAllCurrentAnimations',
        value: function _handleAllCurrentAnimations() {
            var _this = this;

            this._currentAnimations.forEach(function (currentAnimation, index) {
                if (currentAnimation.playhead < 0) {
                    currentAnimation.playhead += currentAnimation.stepRate;
                    console.log(currentAnimation.playhead);
                    return;
                }
                switch (currentAnimation.animationType) {
                    case 'path':
                        _this._handlePathAnimation(index);
                        break;
                    case 'cameraTargetAndFollow':
                        _this._handleCameraTargetAndFolowAnimation(index);
                        break;
                    case 'cameraTargetChange':
                        _this._handleCameraTargetChange(index);
                        break;
                    case 'other':
                        _this._handleOtherAnimation(index);
                        break;
                }
            });
        }
    }, {
        key: '_handleOtherAnimation',
        value: function _handleOtherAnimation(index) {
            var animation = this._currentAnimations[index];
            if (this._animationExpired(animation)) {
                this._removeAnimation(index);
                return;
            }
            animation.playhead += animation.stepRate;
        }
    }, {
        key: '_handlePathAnimation',
        value: function _handlePathAnimation(index) {
            var animation = this._currentAnimations[index];
            var rocket = this._animatedObjectsArray[animation.movingObjectIndex];
            if (this._animationExpired(animation)) {
                this._removePathAnimation(index);
                return;
            }
            if (animation.firstFrame) {
                rocket.inAnimation = true;
                animation.firstFrame = false;
            }

            var path = this._animatedObjectsArray[animation.pathIndex];
            var point = path.getPoint(animation.playhead);
            rocket.nextPosition = point;

            animation.playhead += animation.stepRate;
        }
    }, {
        key: '_handleCameraTargetAndFolowAnimation',
        value: function _handleCameraTargetAndFolowAnimation(index) {
            var animation = this._currentAnimations[index];
            if (this._animationExpired(animation)) {
                this._removeAnimation(index);
                return;
            }
            if (animation.firstFrame) {
                this._thirdPersonCamera.setTarget(this._animatedObjectsArray[0]);
                animation.firstFrame = false;
            }
            animation.playhead += animation.stepRate;
        }

        //todo, update to handle smooth transitions.

    }, {
        key: '_handleCameraTargetChange',
        value: function _handleCameraTargetChange(index) {
            var animation = this._currentAnimations[index];
            var newTarget = this._animatedObjectsArray[animation.newTargetIndex];
            if (animation.firstFrame) {
                var newOffset = this.getVector(newTarget.position, this._thirdPersonCamera.position);
                this._thirdPersonCamera.offsetBeforeTransition = this.getVector(newTarget.position, this._thirdPersonCamera.position);
                this._thirdPersonCamera.offset = newOffset;
                this._thirdPersonCamera.setTarget(this._animatedObjectsArray[animation.newTargetIndex]);
                animation.playhead += animation.stepRate;
                animation.firstFrame = false;
            } else {
                if (this._animationExpired(animation)) {
                    this._removeAnimation(index);
                    return;
                }
                var _newOffset = new THREE.Vector3();
                _newOffset.lerpVectors(this._thirdPersonCamera.offsetBeforeTransition, this._thirdPersonCamera.defaultOffset, animation.playhead);
                this._thirdPersonCamera.offset = _newOffset;
                animation.playhead += animation.stepRate;
            }
        }
    }, {
        key: '_animationExpired',
        value: function _animationExpired(animation) {
            if (animation.playhead >= animation.totalTime) {
                return true;
            } else {
                return false;
            }
        }

        //_addAnimation is intended to be a called function.

        //sequenceID is used to determine if an animation should run after another separate animation or if it should start running simultaneously. If another animation is using the same ID
        //the next animation using that ID will be queued up behind it.
        //SequenceGroup is then used to determine if two animations of the same ID should run simultaneously.
        //This would be useful if you wanted to move the camera and an object at the same time, but as part of a larger animation process.
        //waitForAnimationToFinish, if false, will allow the next group of animations to start running before all animations with a false value are finished. 

    }, {
        key: '_addAnimation',
        value: function _addAnimation(sequenceID, sequenceGroup, totalTime) {
            var waitForAnimationToFinish = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
            var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            var stepRate = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.001;
            var animationType = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'other';
            var delay = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;

            this.inAnimation = true;
            var playhead = 0.000 - delay;
            var animationObject = {
                sequenceID: sequenceID,
                sequenceGroup: sequenceGroup,
                waitForAnimationToFinish: waitForAnimationToFinish,
                playhead: playhead,
                stepRate: stepRate,
                totalTime: totalTime,
                animationType: animationType,
                firstFrame: true
            };
            for (var key in params) {
                if (animationObject[key] != undefined) {
                    console.log("item in params was already assigned by _addAnimation");
                }
                animationObject[key] = params[key];
            }

            var watingForAnotherAnimation = false;
            this._currentAnimations.forEach(function (animationInCurrent) {
                if (animationInCurrent.sequenceID === sequenceID && animationInCurrent.sequenceGroup < sequenceGroup && animationInCurrent.waitForAnimationToFinish === true) {
                    watingForAnotherAnimation = true;
                }
            });
            watingForAnotherAnimation ? this._animationQueue.push(animationObject) : this._currentAnimations.push(animationObject);
            if (animationType === 'other') {
                console.log("Animation of type 'other' was added to the queue");
            }
            // console.log("queue after add")
            // console.log(this._animationQueue);
            // console.log("current after add");
            // console.log(this._currentAnimations)
        }
    }, {
        key: '_addPathAnimation',
        value: function _addPathAnimation(sequenceID, sequenceGroup, path, movingObject) {
            var totalTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.000;
            var stepRate = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.001;
            var animationType = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'path';

            var movingObjectIndex = this._animatedObjectsArray.push(movingObject) - 1;
            var pathIndex = this._animatedObjectsArray.push(path) - 1;
            var waitForAnimationToFinish = true;
            movingObject.inAnimation = true;
            var params = {
                movingObjectIndex: movingObjectIndex,
                pathIndex: pathIndex
            };

            this._addAnimation(sequenceID, sequenceGroup, totalTime, waitForAnimationToFinish, params, stepRate, animationType);
        }
    }, {
        key: '_addCameraTargetAndFolowAnimation',
        value: function _addCameraTargetAndFolowAnimation(sequenceID, sequenceGroup) {
            var totalTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.000;
            var stepRate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.001;
            var animationType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'cameraTargetAndFollow';

            this._addAnimation(sequenceID, sequenceGroup, totalTime, false, {}, stepRate, animationType);
        }

        //totalTime 0 will create an instant transition, other values combined stepRate will create a smooth transition
        //default is an instant transition

    }, {
        key: '_addCameraTargetChange',
        value: function _addCameraTargetChange(sequenceID, sequenceGroup, newTarget) {
            var totalTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var stepRate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var delay = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
            var animationType = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "cameraTargetChange";

            var newTargetIndex = this._animatedObjectsArray.push(newTarget) - 1;
            var params = {
                newTargetIndex: newTargetIndex
            };
            this._addAnimation(sequenceID, sequenceGroup, totalTime, false, params, stepRate, animationType, delay);
        }
    }, {
        key: '_removePathAnimation',
        value: function _removePathAnimation(index) {
            var removedAnimationReference = this._currentAnimations[index];

            var movingObjectIndex = removedAnimationReference.movingObjectIndex;
            this._animatedObjectsArray[movingObjectIndex].inAnimation = false;
            // this._animatedObjectsArray.splice(movingObjectIndex, 1, null);

            // const pathIndex = removedAnimationReference.pathIndex;
            // this._animatedObjectsArray.splice(pathIndex, 1, null);

            this._removeAnimation(index);
        }
    }, {
        key: '_removeAnimation',
        value: function _removeAnimation(index) {
            var _this2 = this;

            var removedAnimationReference = this._currentAnimations[index];
            var removedSequenceID = removedAnimationReference.sequenceID;
            this._currentAnimations.splice(index, 1);

            //the code below handles moving the animations in the queue with the same sequenceID, if any, into currentAnimations.
            var addNextSequenceGroup = true;
            this._currentAnimations.forEach(function (animationInCurrent) {
                if (animationInCurrent.sequenceID === removedSequenceID && animationInCurrent.waitForAnimationToFinish) {
                    addNextSequenceGroup = false;
                }
            });
            if (addNextSequenceGroup) {
                //The below step is a bit superficial, but could prove useful later. The next sequenceGroup could be calculated by adding 1 to the removedSequenceGroup value, but this way
                //some animations in a sequence could be omitted and the later algo would catch those that are later in the sequence.
                var lowestNextSequenceGroup = void 0;
                this._animationQueue.forEach(function (animationInQueue) {
                    if (animationInQueue.sequenceID === removedSequenceID) {
                        if (lowestNextSequenceGroup) {
                            if (animationInQueue.sequenceGroup < lowestNextSequenceGroup) {
                                lowestNextSequenceGroup = animationInQueue.sequenceGroup;
                            }
                        } else {
                            lowestNextSequenceGroup = animationInQueue.sequenceGroup;
                        }
                    }
                });

                this._animationQueue.forEach(function (animationInQueue, index) {
                    if (animationInQueue.sequenceID === removedSequenceID && animationInQueue.sequenceGroup === lowestNextSequenceGroup) {
                        _this2._animationQueue.splice(index, 1);
                        _this2._currentAnimations.push(animationInQueue);
                    }
                });
            }
        }

        // _handleAnimationQueue() {
        //     //An array with all of the sequenceIDs that have an animation currently running. That animation also must have "waitForAnimationToFinish" set to true.
        //     //SequenceIDs that are not included in array, later found in this._animationQueue, will be added to this._currentAnimations.
        //     const sequenceIDsWithSeriesAnimation = [];
        //     this._currentAnimations.forEach((animation) => {
        //         if (animation.waitForAnimationToFinish === true) {
        //             sequenceIDsWithSeriesAnimation.push({
        //                 sequenceID: animation.sequenceID,
        //                 sequenceGroup: animation.sequenceGroup,
        //             });
        //         }
        //     });

        // }

    }, {
        key: '_getUniqueSequenceID',
        value: function _getUniqueSequenceID() {
            var valueInArray = true;
            var newID = 0;
            while (valueInArray) {
                newID++;
                valueInArray = this._usedSequenceIDs.includes(newID);
            }
            this._usedSequenceIDs.push(newID);
            return newID;
        }

        //displays red sphere at positionVector

    }, {
        key: 'getTestPoint',
        value: function getTestPoint(positionVector) {
            var geometry = new THREE.SphereGeometry(0.2, 24, 24);
            var material = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
            var star = new THREE.Mesh(geometry, material);
            star.position.set(positionVector.x, positionVector.y, positionVector.z);
            this._scene.add(star);
        }
    }, {
        key: 'getRadialPosition',
        value: function getRadialPosition(theta, radius) {
            var yValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -2;

            var x = radius * Math.cos(theta);
            var z = radius * Math.sin(theta);
            return new THREE.Vector3(x, yValue, z);
        }

        //todo change name

    }, {
        key: 'getPointWithTheta',
        value: function getPointWithTheta(vector, deltaTheta) {
            var yValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            var x = vector.x;
            var y = vector.z;
            var theta = deltaTheta;
            var newX = Math.cos(theta) - Math.sin(theta);
            var newZ = Math.sin(theta) + Math.cos(theta);
            return new THREE.Vector3(newX, yValue, newZ);
        }
    }, {
        key: 'getVector',
        value: function getVector(pointA, pointB) {
            return new THREE.Vector3(pointB.x - pointA.x, pointB.y - pointA.y, pointB.z - pointA.z);
        }

        //this is the method I used to find the rotation values from the hardcoded points I initially used. Now the animations can be launched from anywhere
        //and still work the same way.

    }, {
        key: 'getQuaternionFromVectors',
        value: function getQuaternionFromVectors(vectorFrom, vectorTo) {
            var reference = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new THREE.Vector3();

            var from = new THREE.Vector3();
            from.copy(vectorFrom);
            from.sub(reference);
            from.normalize();

            var to = new THREE.Vector3();
            to.copy(vectorTo);
            to.sub(reference);
            to.normalize();

            var output = new THREE.Quaternion();
            output.setFromUnitVectors(from, to);
            return output;
        }

        //reference is optional

    }, {
        key: 'getScalarFromVectors',
        value: function getScalarFromVectors(vectorFrom, vectorTo, reference) {
            var from = new THREE.Vector3();
            from.copy(vectorFrom);

            var to = new THREE.Vector3();
            to.copy(vectorTo);

            if (reference) {
                from.sub(reference);
                to.sub(reference);
            }

            var quaternion = this.getQuaternionFromVectors(from, to);
            from.applyQuaternion(quaternion);
            var output = to.divide(from);
            return output;
        }

        //new THREE.Quaternion(-0.47758778857662715, 0.6817708103503712, 0.08020833062945544, 0.5483293627504555)

    }, {
        key: 'getPositionUsingQuaternion',
        value: function getPositionUsingQuaternion(startPoint, referencePoint, quaternion, scalar) {
            var output = new THREE.Vector3();
            output.copy(startPoint);
            output.sub(referencePoint);
            output.applyQuaternion(quaternion);
            output.multiplyScalar(scalar);
            output.add(referencePoint);
            return output;
        }
    }, {
        key: 'launchRocket',
        value: function launchRocket(rocket, destination) {

            var planetPosition = this._thirdPersonCamera.targetPosition;
            var cameraPosition = this._thirdPersonCamera.position;
            var destinationPosition = destination.position;

            var planetTheta = this._thirdPersonCamera.target.theta;
            var planetRadius = this._thirdPersonCamera.target.radius;
            var cameraTheta = this._thirdPersonCamera.theta;
            var cameraRadius = this._thirdPersonCamera.radius;

            var quatro1 = new THREE.Quaternion(-0.042749690783808636, 0.7740255589161532, 0.0910618304607239, 0.6251117029104221);
            var quatro2 = new THREE.Quaternion(-0.47758778857662715, 0.6817708103503712, 0.08020833062945544, 0.5483293627504555);
            var quatro3 = new THREE.Quaternion(0.09619301751625357, 0.44899411012929447, 0.05282283648579934, 0.8867699478421195);
            var quatro4 = new THREE.Quaternion(0.05077657566513715, 0.033260032158517625, 0.003912944959825603, 0.9981483850040926);

            var point1 = this.getPositionUsingQuaternion(cameraPosition, planetPosition, quatro1, 0.074319895);
            var point2 = this.getPositionUsingQuaternion(cameraPosition, planetPosition, quatro2, 1.56);
            var point3 = this.getPositionUsingQuaternion(cameraPosition, planetPosition, quatro3, 1.235886);
            var point4 = this.getPositionUsingQuaternion(cameraPosition, planetPosition, quatro4, 0.8089725);
            var curve = new THREE.CubicBezierCurve3(point1, point2, point3, point4);

            var point5 = this.getVector(point3, point4);
            point5.add(point4);
            var point6 = new THREE.Vector3(0, 40, 0);
            var point7 = new THREE.Vector3();
            point7.copy(destinationPosition);
            point7.x -= 10;
            var curve2 = new THREE.CubicBezierCurve3(point4, point5, point6, point7);

            // const quatro = this.getQuaternionFromVectors(cameraPosition, oldPoint4, planetPosition);
            // console.log("quaternion");
            // console.log(quatro);
            // const scalar = this.getScalarFromVectors(cameraPosition, oldPoint4, planetPosition);
            // console.log("scalar")
            // console.log(scalar);


            var sequenceID = this._getUniqueSequenceID();
            this._addPathAnimation(sequenceID, 1, curve, rocket, 1, 0.006, "path");
            this._addCameraTargetChange(sequenceID, 1, rocket, 1, 0.01);
            this._addPathAnimation(sequenceID, 2, curve2, rocket, 1, 0.005, "path");
            this._addCameraTargetChange(sequenceID, 2, destination, 1, 0.01, .05);

            var points = curve2.getPoints(50);
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
            var curveObject = new THREE.Line(geometry, material);
            //this._scene.add(curveObject);
        }
    }]);

    return AnimationEngine;
}();

//below is an example of the animation state during operation.
// this._currentAnimations = [
//     {
//         sequenceID: 1,
//         sequenceGroup: 4,
//         waitForAnimationToFinish: true,
//         playhead: 0.001,
//         stepRate: 0.004,
//         totalTime: 1,
//         animationType: "path",
//         movingObjectIndex: 0,
//         pathIndex: 1
//     },
//     {
//         sequenceID: 2,
//         sequenceGroup: 1,
//         waitForAnimationToFinish: true,
//         playhead: 0.001,
//         stepRate: 0.002,
//         totalTime: 2,
//         animationType: "path",
//         movingObjectIndex: 2,
//         pathIndex: 3
//     },
//     {
//         sequenceID: 2,
//         sequenceGroup: 1,                    //even though this animation's sequenceID is the same as the last, both are allowed to be in  this._currentAnimations
//         waitForAnimationToFinish: true,      //because thier sequenceGroup is the same. This allows multiple animations to occur in parallel.
//         playhead: 0.001,
//         stepRate: 0.002,
//         totalTime: 2,
//         animationType: "path",
//         movingObjectIndex: 4,
//         pathIndex: 5
//     }
//     
// ]


// const point1 = this.getRadialPosition(planetTheta + .01, planetRadius + 1, 0)
// const point2 = this.getRadialPosition(planetTheta + .1, planetRadius + 20, 15);
// const point3 = this.getRadialPosition(planetTheta + .25, planetRadius + 5, -5);
// const point4 = this.getRadialPosition(cameraTheta -.03, cameraRadius + 3, -3)


export default AnimationEngine;