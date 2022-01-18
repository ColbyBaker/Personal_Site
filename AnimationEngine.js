import * as THREE from 'three';

export default class AnimationEngine{
    constructor(scene, thirdPersonCamera ) {
        this._scene = scene;
        this._thirdPersonCamera = thirdPersonCamera;
        
        this.inAnimation = false;

        this._animatedObjectsArray = [];
        //see bottom of file for an example of _currentAnimations during operation.
        this._currentAnimations = [];
        this._animationQueue = [];
        this._usedSequenceIDs = [];
    }

    update(){
        if (this.inAnimation) {
            this.handleCurrentAnimations();
        }
    }

    handleCurrentAnimations() {
        this._currentAnimations.forEach((currentAnimation, index) => {
            switch (currentAnimation.animationType) {
                case 'path':
                    this._handlePathAnimation(index);
            }
        })
    }


    _handlePathAnimation(index){
        const animation = this._currentAnimations[index];
        if (this._animationExpired(animation)) {
            this._removePathAnimation(index);
            return;
        }

        const path = this._animatedObjectsArray[animation.pathIndex];
        const point = path.getPoint(animation.playhead);
        const rocket = this._animatedObjectsArray[animation.movingObjectIndex];
        rocket.position = point;

        animation.playhead += animation.stepRate;
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
    _addAnimation(sequenceID, sequenceGroup, totalTime, waitForAnimationToFinish = true, params = {}, stepRate = 0.001, animationType = 'other') {
        this.inAnimation = true;

        let animationObject = {
            sequenceID: sequenceID,
            sequenceGroup: sequenceGroup,
            waitForAnimationToFinish: waitForAnimationToFinish,
            playhead: 0.001,
            stepRate: stepRate,
            totalTime: totalTime,
            animationType: animationType,
        };
        for (const key in params) {
            if (animationObject[key] != undefined) {
                console.log("item in params was already assigned by _addAnimation");
            }
            animationObject[key] = params[key];
        }

        let watingForAnotherAnimation = false;
        this._currentAnimations.forEach((animationInCurrent) => {
            if (animationInCurrent.sequenceID === sequenceID && animationInCurrent.sequenceGroup < sequenceGroup && animationInCurrent.waitForAnimationToFinish === true) {
                watingForAnotherAnimation = true;
            }
        });
        watingForAnotherAnimation ? this._animationQueue.push(animationObject) : this._currentAnimations.push(animationObject);
        console.table(this._currentAnimations)
    }

    _addPathAnimation(sequenceID, sequenceGroup, path, movingObject, totalTime = 1.000, stepRate = 0.001, animationType = 'path') {
        const movingObjectIndex = this._animatedObjectsArray.push(movingObject) - 1;
        const pathIndex = this._animatedObjectsArray.push(path) - 1;
        const waitForAnimationToFinish = true;
        movingObject.inAnimation = true;
        const params = {
            movingObjectIndex: movingObjectIndex,
            pathIndex: pathIndex, 
        };

        this._addAnimation(sequenceID, sequenceGroup, totalTime, waitForAnimationToFinish, params, stepRate, animationType);
    }

    _removePathAnimation(index) {
        const removedAnimationReference = this._currentAnimations[index];

        const movingObjectIndex = removedAnimationReference.movingObjectIndex;
        this._animatedObjectsArray[movingObjectIndex].inAnimation = false;
        this._animatedObjectsArray.splice(movingObjectIndex, 1, null);

        const pathIndex = removedAnimationReference.pathIndex;
        this._animatedObjectsArray.splice(pathIndex, 1, null);

        this._removeAnimation(index);
    }

    _removeAnimation(index) {
        const removedAnimationReference = this._currentAnimations[index];
        const removedSequenceID = removedAnimationReference.sequenceID;
        this._currentAnimations.splice(index, 1);

        
        //the code below handles moving the animations in the queue with the same sequenceID, if any, into currentAnimations.
        let addNextSequenceGroup = true;
        this._currentAnimations.forEach((animationInCurrent) => {
            if (animationInCurrent.sequenceID === removedSequenceID && animationInCurrent.waitForAnimationToFinish) {
                addNextSequenceGroup = false;
            }
        });
        if (addNextSequenceGroup) {
            //The below step is a bit superficial, but could prove useful later. The next sequenceGroup could be calculated by adding 1 to the removedSequenceGroup value, but this way
            //some animations in a sequence could be omitted and the later algo would catch those that are later in the sequence.
            let lowestNextSequenceGroup;
            this._animationQueue.forEach((animationInQueue) => {
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


            this._animationQueue.forEach((animationInQueue, index) => {
                if (animationInQueue.sequenceID === removedSequenceID && animationInQueue.sequenceGroup === lowestNextSequenceGroup) {
                    this._animationQueue.splice(index, 1);
                    this._currentAnimations.push(animationInQueue);
                }
            })
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

    getRadialPosition(theta, radius) {
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta); 
        return new THREE.Vector3(x, -2, z)
    }

    //todo change name
    getPointWithTheta(vector, deltaTheta) {
        const x = vector.x;
        const y = vector.z;
        const theta = deltaTheta;
        const newX = Math.cos(theta) - Math.sin(theta);
        const newY = Math.sin(theta) + Math.cos(theta);
        return new THREE.Vector3(newX, 0, newY);
    }




    launchRocket(rocket) {

        const planetPosition = this._thirdPersonCamera.targetRadialPosition;
        const cmaeraPosition = this._thirdPersonCamera.position;
        const planetTheta = this._thirdPersonCamera.target.theta;
        const planetRadius = this._thirdPersonCamera.target.radius;

        const cameraTheta = this._thirdPersonCamera.theta;
        const cameraRadius = this._thirdPersonCamera.radius;


        const point1 = this.getRadialPosition(planetTheta + .01, planetRadius + 1)
        const point2 = this.getRadialPosition(planetTheta - .1, planetRadius + 22.5);
        const point3 = this.getRadialPosition(planetTheta + .2, planetRadius + 20);
        const point4 = this.getRadialPosition(cameraTheta -.03, cameraRadius + 5)
        let curve = new THREE.CubicBezierCurve3(point1, point2, point3, point4);

        this._addPathAnimation(this._getUniqueSequenceID(), 1, curve, rocket, 1, 0.007, "path");


        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
        const curveObject = new THREE.Line( geometry, material );
        //this._scene.add(curveObject);
    }
}


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