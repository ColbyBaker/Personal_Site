import * as THREE from 'three';

export default class AnimationEngine{
    constructor(scene, thirdPersonCamera ) {
        this._scene = scene;
        this._thirdPersonCamera = thirdPersonCamera;
        
        this.inAnimation = false;

        this._objectsArray = [];
        //see the bottom of the file for an example of _animationState during operation.
        this._currentAnimations = [];
        //animation queue must remain sequential during additions and iterations.
        this._animationQueue = [];
        this._usedAnimationIDs = [];
    }

    update(){
        if (this.inAnimation) {
            this.handleCurrentAnimations();
        }
    }

    handleCurrentAnimations() {
        this._currentAnimations.forEach((animation, index) => {
            if (animation.playhead >= animation.totalTime) {
                this._removeAnimation(index)
            }
        })
        this.handlePathAnimations();
    }


    handlePathAnimations(){
        for (let x = 0; x < this._currentAnimations.length; x++) {
            const animation = this._currentAnimations[x];
            if (animation.animationType === "path") {
                const path = this._objectsArray[animation.pathIndex];
                const point = path.getPoint(animation.playhead);
                const rocket = this._objectsArray[animation.animatedObjectIndex];
                rocket.position = point;

                animation.playhead += animation.stepRate;

            }
        }
    }

    //_addAnimation is intended to be a called function.

    //animationID is used to determine if an animation should run after another separate animation 
    // or if it should start running simultaneously. If another animation is using the same ID
    //the next animation using that ID will be queued up behind it.
    _addAnimation(animationID, sequence, totalTime, params = {}, stepRate = 0.001, animationType = 'other') {
        this.inAnimation = true;

        let animationObject = {
            animationID: animationID,
            sequence: sequence,
            playhead: 0.001,
            stepRate: stepRate,
            totalTime: totalTime,
            animationType: animationType,
        };
        for (const key in params) {
            if (animationObject[key] != undefined) {
                console.log("item in params was already assigned by _addAnimation")
            }
            animationObject[key] = params[key];
        }

        let animationWithSameIDInCurrent = false;
        this._currentAnimations.forEach((currentAnimation) => {
            if (currentAnimation.animationID === animationID) {
                animationWithSameIDInCurrent = true;
            }
        });
        animationWithSameIDInCurrent ? this._animationQueue.push(animationObject) : this._currentAnimations.push(animationObject);
    }

    _addPathAnimation(animationID, sequence, path, animatedObject, totalTime = 1.000, stepRate = 0.001, animationType = 'path') {
        const animatedObjectIndex = this._objectsArray.push(animatedObject) - 1;
        const pathIndex = this._objectsArray.push(path) - 1;
        const params = {
            animatedObjectIndex: animatedObjectIndex,
            pathIndex: pathIndex, 
        };

        this._addAnimation(animationID, sequence, totalTime, params, stepRate, animationType);
    }

    _removeAnimation(index) {
        const removedAnimationReference = this._currentAnimations[index]
        const removedAnimationID = removedAnimationReference.animationID;
        this._currentAnimations.splice(index, 1);
        let anotherAnimationInQueueWithSameID = false;
        this._animationQueue.forEach((animation, index) => {
            if (animation.animationID === removedAnimationID) {
                this._currentAnimations.push(this._animationQueue[index]);
                this._animationQueue.splice(index, 1);
                anotherAnimationInQueueWithSameID = true;
            }
        });

        if (!anotherAnimationInQueueWithSameID) {
            this._objectsArray[removedAnimationReference.animatedObjectIndex].inAnimation = false;
            //remove this
            this._thirdPersonCamera.setTarget(this._objectsArray[removedAnimationReference.animatedObjectIndex]);

            this._objectsArray.splice(removedAnimationReference.animatedObjectIndex, 1, null);
            this._objectsArray.splice(removedAnimationReference.pathIndex, 1, null);
            this._usedAnimationIDs = this._usedAnimationIDs.filter((animationID) => {
                return animationID != removedAnimationID;
            });
        }

        if (this._currentAnimations.length === 0 && this._animationQueue.length === 0) {
            this.inAnimation = false;
        }
    }

    _getUniqueAnimationID() {
        let valueInArray = true;
        let newID = 0;
        while (valueInArray) {
            newID++;
            valueInArray = this._usedAnimationIDs.includes(newID);
        }
        this._usedAnimationIDs.push(newID);
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

        rocket.inAnimation = true;
        this._addPathAnimation(this._getUniqueAnimationID(), 1, curve, rocket, 1, 0.007, "path");


        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
        const curveObject = new THREE.Line( geometry, material );
        //this._scene.add(curveObject);
    }
}



//todo update this:
//below is an example of the animation state during operation.
        // this._animationState = {
        //     1: {
        //         playhead: 0.300,
        //         stepRate: 0.001,
        //         totalTime: 1.000,
        //     }
                // 2: {
                //     playhaed: 0.100,
                //     stepRate: 0.002,
                //     totalTime: 2.000,
                // }
        // }