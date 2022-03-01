import * as THREE from 'three';
import CameraTarget from './CameraTarget';

export default class AnimationEngine {
    constructor(scene, thirdPersonCamera ) {
        this._scene = scene;
        this._thirdPersonCamera = thirdPersonCamera;
        
        this.inAnimation = false;
        this.inNavbarAnimation = false;

        this._animatedObjectsArray = [];
        //see bottom of file for an example of _currentAnimations during operation.
        this._currentAnimations = [];
        this._animationQueue = [];
        this._usedSequenceIDs = [];
    }

    update(){
        if (this.inAnimation) {
            this._handleAllCurrentAnimations();
        }
    }

    // if (this._animationExpired(animation)) {
    //     this._removeAnimation(index);
    //     return;
    // }

    _handleAllCurrentAnimations() {
        this._currentAnimations.forEach((currentAnimation, index) => {
            if (this._animationExpired(currentAnimation)) {
                this._removeAnimation(index);
            }
        });
        this._handleAnimationQueue();
        //handles delay
        this._currentAnimations.forEach((currentAnimation, index) => {
            if (currentAnimation.playhead < 0) {
                currentAnimation.playhead += currentAnimation.stepRate;
                return;
            }
            switch (currentAnimation.animationType) {
                case 'path':
                    this._handleRocketPathAnimation(index);
                    break;
                case 'cameraTargetPath':
                    this._handleCameraTargetPathAnimation(index);
                    break;
                case 'cameraTargetAndFollow':
                    this._handleCameraTargetAndFolowAnimation(index);
                    break;
                case 'cameraTargetChange':
                    this._handleCameraTargetChange(index);
                    break;
                case 'rocketToOrbit':
                    this._handleRocketToOrbit(index);
                    break;
                case 'navbarTrigger':
                    this._handleNavbarTrigger(index);
                    break;
                case 'other':
                    this._handleOtherAnimation(index);
                    break;
            }
        });
    }

    _handleAnimationQueue() {
        this._usedSequenceIDs.forEach(currentSequenceID => {
            let lowestCurrentSequenceGroup = Infinity;
            this._currentAnimations.forEach(currentAnimation => {
                if (currentAnimation.sequenceID === currentSequenceID && currentAnimation.waitForAnimationToFinish) {
                    lowestCurrentSequenceGroup = currentAnimation.sequenceGroup;
                }
            });
            this._animationQueue.forEach(currentAnimation => {
                if (currentAnimation.sequenceID === currentSequenceID && currentAnimation.sequenceGroup < lowestCurrentSequenceGroup) {
                    lowestCurrentSequenceGroup = currentAnimation.sequenceGroup;
                }
            });
            this._animationQueue.forEach((currentAnimation, index) => {
                if (currentAnimation.sequenceID === currentSequenceID && currentAnimation.sequenceGroup <= lowestCurrentSequenceGroup) {
                    this._currentAnimations.push(currentAnimation);
                    this._animationQueue.splice(index, 1);
                }
            });
        });
    }

    _handleOtherAnimation(index) {
        const animation = this._currentAnimations[index];
        animation.playhead += animation.stepRate;
    }


    _handleRocketPathAnimation(index){
        const animation = this._currentAnimations[index];
        const rocket = this._animatedObjectsArray[animation.animatedObjects.movingObjectIndex];
        if (animation.firstFrame) {
            rocket.inAnimation = true;
            animation.firstFrame = false;
        }

        const path = this._animatedObjectsArray[animation.animatedObjects.pathIndex];
        const point = path.getPoint(animation.playhead);
        rocket.nextPosition = point;

        animation.playhead += animation.stepRate;
    }

    _handleCameraTargetPathAnimation(index){
        const animation = this._currentAnimations[index];
        const targetIndex = animation.animatedObjects.targetIndex;
        const target = this._animatedObjectsArray[targetIndex];
        if (animation.firstFrame) {
            target.inAnimation = true;
            animation.firstFrame = false;
        }

        const path = this._animatedObjectsArray[animation.animatedObjects.pathIndex];
        const point = path.getPoint(animation.playhead);
        target.position = point;

        animation.playhead += animation.stepRate;
    }

    _handleCameraTargetAndFolowAnimation(index) {
        const animation = this._currentAnimations[index];
        if (animation.firstFrame) {
            this._thirdPersonCamera.setTarget(this._animatedObjectsArray[0]);
            animation.firstFrame = false;
        }
        animation.playhead += animation.stepRate;
    }

    //todo, update to handle smooth transitions.
    _handleCameraTargetChange(index) {
        const animation = this._currentAnimations[index];
        const newTarget = this._animatedObjectsArray[animation.params.newTargetIndex];
        if (animation.firstFrame) {
            const newOffset = this.getVector(newTarget.position, this._thirdPersonCamera.position);
            this._thirdPersonCamera.offsetBeforeTransition = this.getVector(newTarget.position, this._thirdPersonCamera.position);
            this._thirdPersonCamera.offset = newOffset;
            this._thirdPersonCamera.setTarget(newTarget);
            animation.playhead += animation.stepRate;
            animation.firstFrame = false;
        } else {
            const newOffset = new THREE.Vector3();
            newOffset.lerpVectors(this._thirdPersonCamera.offsetBeforeTransition, this._thirdPersonCamera.defaultOffset, animation.playhead);
            this._thirdPersonCamera.offset = newOffset;
            animation.playhead += animation.stepRate;
        }
    }

    _handleRocketToOrbit(index) {
        const animation = this._currentAnimations[index];
        const rocket = this._animatedObjectsArray[animation.animatedObjects.rocketIndex];
        const params = animation.params;
        if (animation.firstFrame) {
            rocket.setOrbit(params.radius, params.theta, params.stepRate, params.yValue);
            animation.firstFrame = false;
        }
        animation.playhead += animation.stepRate;
    }

    _handleNavbarTrigger(index) {
        const animation = this._currentAnimations[index];
        if (animation.firstFrame) {
            this.inNavbarAnimation = animation.params.inNavbarAnimation;
            animation.firstFrame = false;
        }
    }

    _animationExpired(animation) {
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
    _addAnimation(sequenceID, sequenceGroup, totalTime, waitForAnimationToFinish = true, animatedObjects = {}, params = {}, stepRate = 0.001, animationType = 'other', delay = 0) {
        this.inAnimation = true;
        const playhead = 0.000 - delay;
        if (!this._usedSequenceIDs.includes(sequenceID)) {
            this._usedSequenceIDs.push(sequenceID);
        }
        let animationObject = {
            sequenceID: sequenceID,
            sequenceGroup: sequenceGroup,
            waitForAnimationToFinish: waitForAnimationToFinish,
            animatedObjects: animatedObjects,
            params, params,
            playhead: playhead,
            stepRate: stepRate,
            totalTime: totalTime,
            animationType: animationType,
            firstFrame: true,
        };
        this._animationQueue.push(animationObject);

        // let watingForAnotherAnimation = false;
        // this._currentAnimations.forEach((animationInCurrent) => {
        //     if (animationInCurrent.sequenceID === sequenceID && animationInCurrent.sequenceGroup < sequenceGroup && animationInCurrent.waitForAnimationToFinish === true) {
        //         watingForAnotherAnimation = true;
        //     }
        // });
        // watingForAnotherAnimation ? this._animationQueue.push(animationObject) : this._currentAnimations.push(animationObject);
        // if (animationType === 'other') {
        //     console.log("Animation of type 'other' was added to the queue");
        // }
        // console.log("queue after add")

    }

    _addRocketPathAnimation(sequenceID, sequenceGroup, path, movingObject, totalTime = 1.000, stepRate = 0.001, animationType = 'path') {
        const movingObjectIndex = this._animatedObjectsArray.push(movingObject) - 1;
        const pathIndex = this._animatedObjectsArray.push(path) - 1;
        const waitForAnimationToFinish = true;
        const animatedObjects = {
            movingObjectIndex: movingObjectIndex,
            pathIndex: pathIndex,
        };

        this._addAnimation(sequenceID, sequenceGroup, totalTime, waitForAnimationToFinish, animatedObjects, {}, stepRate, animationType);
    }

    _addCameraTargetPathAnimation(sequenceID, sequenceGroup, path, movingObject, totalTime = 1.000, stepRate = 0.001, animationType = 'cameraTargetPath') {
        const targetIndex = this._animatedObjectsArray.push(movingObject) - 1;
        const pathIndex = this._animatedObjectsArray.push(path) - 1;
        const waitForAnimationToFinish = true;
        movingObject.inAnimation = true;
        const animatedObjects = {
            targetIndex: targetIndex,
            pathIndex: pathIndex,
        };

        this._addAnimation(sequenceID, sequenceGroup, totalTime, waitForAnimationToFinish, animatedObjects, {}, stepRate, animationType);
    }

    // _addCameraTargetAndFolowAnimation(sequenceID, sequenceGroup, totalTime = 1.000, stepRate = 0.001, animationType = 'cameraTargetAndFollow') {
    //     this._addAnimation(sequenceID, sequenceGroup, totalTime, false, {}, stepRate, animationType);
    // }

    //totalTime 0 will create an instant transition, other values combined stepRate will create a smooth transition
    //default is an instant transition
    _addCameraTargetChange(sequenceID, sequenceGroup, newTarget, totalTime = 0, stepRate = 0, delay = 0, animationType="cameraTargetChange") {
        const newTargetIndex = this._animatedObjectsArray.push(newTarget) - 1;
        const params = {
            newTargetIndex: newTargetIndex,
        }
        this._addAnimation(sequenceID, sequenceGroup, totalTime, false, {}, params, stepRate, animationType, delay);
    }

    _addRocketToOrbit(sequenceID, sequenceGroup, rocket, theta, stepRate, radius, yValue, delay = 0) {
        const rocketIndex = this._animatedObjectsArray.push(rocket) - 1;
        const animatedObjects = {
            rocketIndex: rocketIndex,
        }
        const params = {
            theta: theta,
            stepRate: stepRate,
            radius: radius,
            yValue: yValue,
        }
        this._addAnimation(sequenceID, sequenceGroup, .5, false, animatedObjects, params, 0.1, "rocketToOrbit", delay);
    }

    _addNavbarTrigger(sequenceID, sequenceGroup, inNavbarAnimation) {
        const params = {
            inNavbarAnimation: inNavbarAnimation,
        }
        this._addAnimation(sequenceID, sequenceGroup, 0.1, false, {}, params, 0.1, "navbarTrigger");
    }

    // _removeRocketPathAnimation(index) {
    //     const removedAnimationReference = this._currentAnimations[index];

    //     const movingObjectIndex = removedAnimationReference.movingObjectIndex;
    //     this._animatedObjectsArray[movingObjectIndex].inAnimation = false;
    //     // this._animatedObjectsArray.splice(movingObjectIndex, 1, null);

    //     // const pathIndex = removedAnimationReference.pathIndex;
    //     // this._animatedObjectsArray.splice(pathIndex, 1, null);

    //     this._removeAnimation(index);
    // }

    // _removeCameraTargetPathAnimation(index) {
    //     const removedAnimationReference = this._currentAnimations[index];

    //     const targetIndex = removedAnimationReference.targetIndex;
    //     this._animatedObjectsArray[targetIndex].inAnimation = false;

    //     this._removeAnimation(index);
    // }

    _removeAnimation(index) {
        //this portion of the function handles cleanup of the arrays that store object references
        //for the animated items and other objects.
        const removedAnimationReference = this._currentAnimations[index];
        const removedSequenceID = removedAnimationReference.sequenceID;
        this._currentAnimations.splice(index, 1);
        if (removedAnimationReference.animatedObjects) {
            for (const item in removedAnimationReference.animatedObjects) {
                const objectIndex = removedAnimationReference.animatedObjects[item];
                const animatedObjectReference = this._animatedObjectsArray[objectIndex];
                animatedObjectReference.inAnimation = false;
                this._animatedObjectsArray.splice(objectIndex, 1, null);
            }
        }

        if (removedAnimationReference.params) {
            for (const item in removedAnimationReference.params) {
                const objectIndex = removedAnimationReference.params[item];
                this._animatedObjectsArray.splice(objectIndex, 1, null);
            }
        }

        //below handles removing unused sequenceID's from the array.
        let sequenceIDStillInUse = false;
        this._currentAnimations.forEach(currentAnimation => {
            if (currentAnimation.sequenceID === removedSequenceID) {
                sequenceIDStillInUse = true;
            }
        });
        this._animationQueue.forEach(currentAnimation => {
            if (currentAnimation.sequenceID === removedSequenceID) {
                sequenceIDStillInUse = true;
            }
        });
        if (!sequenceIDStillInUse) {
            this._usedSequenceIDs = this._usedSequenceIDs.filter(currentID => {
                return currentID != removedSequenceID
            });
        }
    }

    _getUniqueSequenceID() {
        let valueInArray = true;
        let newID = 0;
        while (valueInArray) {
            newID++;
            valueInArray = this._usedSequenceIDs.includes(newID);
        }
        this._usedSequenceIDs.push(newID);
        return newID;
    }

    //displays red sphere at positionVector
    getTestPoint(positionVector) {
        const geometry = new THREE.SphereGeometry(0.2, 24, 24);
        const material = new THREE.MeshStandardMaterial( {color: 0xFF0000 });
        const star = new THREE.Mesh( geometry, material );
        star.position.set(positionVector.x, positionVector.y, positionVector.z);
        this._scene.add(star);
    }

    getRadialPosition(theta, radius, yValue = -2) {
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta); 
        return new THREE.Vector3(x, yValue, z);
    }

    modifyPositionUsingTheta(vector, deltaTheta, yValue = 0) {
        const x = vector.x;
        const y = vector.z;
        const theta = deltaTheta;
        const newX = Math.cos(theta) - Math.sin(theta);
        const newZ = Math.sin(theta) + Math.cos(theta);
        return new THREE.Vector3(newX, yValue, newZ);
    }

    getVector(pointA, pointB) {
        return new THREE.Vector3(pointB.x - pointA.x, pointB.y - pointA.y, pointB.z - pointA.z);
    }

    //this is the method I used to find the rotation values from the hardcoded points I initially used. Now the animations can be launched from anywhere
    //and still work the same way.
    getQuaternionFromVectors(vectorFrom, vectorTo, reference = new THREE.Vector3()) {
        const from = new THREE.Vector3();
        from.copy(vectorFrom);
        from.sub(reference);
        from.normalize();

        const to = new THREE.Vector3();
        to.copy(vectorTo);
        to.sub(reference);
        to.normalize();

        let output = new THREE.Quaternion();
        output.setFromUnitVectors(from, to);
        return output;
    }

    //reference is optional
    getScalarFromVectors(vectorFrom, vectorTo, reference) {
        const from = new THREE.Vector3();
        from.copy(vectorFrom);

        const to = new THREE.Vector3();
        to.copy(vectorTo);

        if (reference) {
            from.sub(reference);
            to.sub(reference);
        }

        const quaternion = this.getQuaternionFromVectors(from, to);
        from.applyQuaternion(quaternion);
        const output = to.divide(from);
        return output;
    }

    //new THREE.Quaternion(-0.47758778857662715, 0.6817708103503712, 0.08020833062945544, 0.5483293627504555)

    getPositionUsingQuaternion(startPoint, referencePoint, quaternion, scalar) {
        const output = new THREE.Vector3();
        output.copy(startPoint);
        output.sub(referencePoint);
        output.applyQuaternion(quaternion);
        output.multiplyScalar(scalar);
        output.add(referencePoint);
        return output;
    }



    launchNewRocketToPlanet(rocket, destination) {
        this.inNavbarAnimation = true;
        const sequenceID = this._getUniqueSequenceID();
        const cameraTargetPosition = this._thirdPersonCamera.targetPosition;
        const trackPoint = new CameraTarget([cameraTargetPosition.x, cameraTargetPosition.y, cameraTargetPosition.z]);
        let [previousPoint, startPoint, lastSequenceGroup] = this._launchRocketFromPlanet(sequenceID, rocket, trackPoint);
        let startingSequenceGroup = lastSequenceGroup += 1;
        lastSequenceGroup = this._flyRocketToPlanet(sequenceID, startingSequenceGroup, rocket, trackPoint, destination, previousPoint, startPoint)
        this._addNavbarTrigger(sequenceID, lastSequenceGroup + 1, false);
    }

    launchNewRocketToOrbit(rocket) {
        this.inNavbarAnimation = true;
        const sequenceID = this._getUniqueSequenceID;
        const cameraTargetPosition = this._thirdPersonCamera.targetPosition;
        const theta = .8;
        const radius = 300;
        const yValue = 20;
        const stepRate = 80;
        const trackPoint = new CameraTarget([cameraTargetPosition.x, cameraTargetPosition.y, cameraTargetPosition.z]);
        let [previousPoint, startPoint, lastSequenceGroup] = this._launchRocketFromPlanet(sequenceID, rocket, trackPoint);
        lastSequenceGroup = this._moveRocketToOrbit(sequenceID, lastSequenceGroup, startPoint, previousPoint, rocket, theta, stepRate, radius, yValue);
        this._addNavbarTrigger(sequenceID, lastSequenceGroup + 1, false);
    }

    moveRocketToPlanet(rocket, destination) {
        this.inNavbarAnimation = true;
        const sequenceID = this._getUniqueSequenceID;
        const cameraTargetPosition = this._thirdPersonCamera.targetPosition;
        const trackPoint = new CameraTarget([cameraTargetPosition.x, cameraTargetPosition.y, cameraTargetPosition.z]);
        rocket.inOrbit = false;
        const startPoint = rocket.position;
        const previousPoint = this.getRadialPosition(rocket.theta - 0.6, rocket.orbitRadius, rocket.orbitYHeight - 60);

        this._addCameraTargetChange(sequenceID, 1, trackPoint, 1, 0.01);
        let lastSequenceGroup = this._flyRocketToPlanet(sequenceID, 1, rocket, trackPoint, destination, previousPoint, startPoint);
        this._addNavbarTrigger(sequenceID, lastSequenceGroup + 1, false);
    }

    _launchRocketFromPlanet(sequenceID, rocket, trackPoint) {
        const cameraPosition = this._thirdPersonCamera.position;

        const planetPosition = this._thirdPersonCamera.target.position;
        const planetTheta = this._thirdPersonCamera.target.theta;
        const planetRadius = this._thirdPersonCamera.target.radius;
        const cameraTheta = this._thirdPersonCamera.theta;
        const cameraRadius = this._thirdPersonCamera.radius;

        const quatro1 = new THREE.Quaternion(-0.042749690783808636, 0.7740255589161532, 0.0910618304607239, 0.6251117029104221);
        const quatro2 = new THREE.Quaternion(-0.47758778857662715, 0.6817708103503712, 0.08020833062945544, 0.5483293627504555);
        const quatro3 = new THREE.Quaternion(0.09619301751625357, 0.44899411012929447, 0.05282283648579934, 0.8867699478421195);
        const quatro4 = new THREE.Quaternion(0.05077657566513715, 0.033260032158517625, 0.003912944959825603, 0.9981483850040926);

        const point1 = this.getPositionUsingQuaternion(cameraPosition, planetPosition, quatro1, 0.074319895);
        const point2 = this.getPositionUsingQuaternion(cameraPosition, planetPosition, quatro2, 1.56);
        const point3 = this.getPositionUsingQuaternion(cameraPosition, planetPosition, quatro3, 1.235886);
        const point4 = this.getPositionUsingQuaternion(cameraPosition, planetPosition, quatro4, 0.8089725);
        let curve = new THREE.CubicBezierCurve3(point1, point2, point3, point4);

        let sequenceGroup = 1
        this._addRocketPathAnimation(sequenceID, sequenceGroup, curve, rocket, 1, 0.006, "path");
        this._addCameraTargetChange(sequenceID, sequenceGroup, trackPoint, 1, 0.01);
        this._addCameraTargetPathAnimation(sequenceID, sequenceGroup, curve, trackPoint, 1, 0.006);
        return [point3, point4, sequenceGroup];
    }

    _flyRocketToPlanet(sequenceID, startingSequenceGroup, rocket, trackPoint, destination, previousPoint, startPoint) {

        let point2 = this.getVector(previousPoint, startPoint);
        point2.add(startPoint);
        const point3 = new THREE.Vector3(0, 40, 0);
        const point4 = new THREE.Vector3();
        const point5 = new THREE.Vector3();
        point4.copy(destination.position);
        point5.copy(destination.position);
        point4.x -= 10;
        let curve2 = new THREE.CubicBezierCurve3(startPoint, point2, point3, point4);
        let curve3 = new THREE.CubicBezierCurve3(startPoint, point2, point3, point5);

        let sequenceGroup = startingSequenceGroup;
        this._addRocketPathAnimation(sequenceID, sequenceGroup, curve2, rocket, 1, 0.005, "path");
        this._addCameraTargetPathAnimation(sequenceID, sequenceGroup, curve3, trackPoint, 1, 0.005);

        this._addCameraTargetChange(sequenceID, sequenceGroup, destination, .1, 0.01, 2);
        return sequenceGroup
    }

    _moveRocketToOrbit(sequenceID, lastSequenceGroup, startPoint, previousPoint, rocket, theta, stepRate, radius, yValue) {
        const destination = this.getRadialPosition(theta, radius, yValue);
        let point2 = this.getVector(previousPoint, startPoint);
        point2.multiplyScalar(8);
        point2.y += 20;
        point2.add(startPoint);
        const point3 = this.getRadialPosition(theta - .6, radius + 20, yValue);
        let curve = new THREE.CubicBezierCurve3(startPoint, point2, point3, destination);

        let sequenceGroup = lastSequenceGroup + 1;
        this._addRocketPathAnimation(sequenceID, sequenceGroup, curve, rocket, 1, 0.003, "path");
        this._addCameraTargetChange(sequenceID, sequenceGroup, rocket, .1, 0.01);
        sequenceGroup++;
        this._addRocketToOrbit(sequenceID, sequenceGroup, rocket, theta, stepRate, radius, yValue);
        return sequenceGroup;
    }


}


//below is an rough example of the animation state during operation.
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

        // const points = curve2.getPoints( 50 );
        // const geometry = new THREE.BufferGeometry().setFromPoints( points );
        // const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
        // const curveObject = new THREE.Line( geometry, material );
        //this._scene.add(curveObject);

        // const points = curve.getPoints( 50 );
        // const geometry = new THREE.BufferGeometry().setFromPoints( points );
        // const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
        // const curveObject = new THREE.Line( geometry, material );
        // this._scene.add(curveObject);