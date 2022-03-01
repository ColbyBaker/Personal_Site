import p5 from 'p5';
import threeDObject from './threeDObject.js'
import * as THREE from 'three';

export default class Rocket extends threeDObject{
    constructor(initialPosition, flocking = true, inAnimation = false, initialVelocity = new THREE.Vector3()) {
        super(initialPosition, inAnimation);

        this._scale = new THREE.Vector3(.8, 1, .8)
        this._scale.multiplyScalar(1)//.6
        this.fileName = 'rocket.glb';
        this._model;

        this._sceneMin = -700;
        this._sceneMax = 700;


        this._velocity = new THREE.Vector3(initialVelocity[0], initialVelocity[1], initialVelocity[2]);
        if (this._velocity.x === 0 && this._velocity.y === 0, this._velocity.z === 0) {
            this._velocity.randomDirection();
        }
        this._velocity = this.setMagnitude(this._velocity, 1);
        this._acceleration = new THREE.Vector3();
        this.flocking = flocking;

        //both below are used for animation purposes.
        this._lastPosition = new THREE.Vector3();
        this._nextPosition = this._position.clone();

        this.inOrbit = false;
        this._orbitRadius;
        this._theta;
        this._deltaTheta;
        this._orbitYHeight;

        this._perception = 20;
        this._maxForce = .01;
        this._maxSpeed = .8;

        this._alignmentScalar = 1.7;
        this._cohesionScalar = .5;
        this._separationScalar = .2;

        document.getElementById("alignment").value = this._alignmentScalar;
        document.getElementById("cohesion").value = this._cohesionScalar;
        document.getElementById("separation").value = this._separationScalar;

        document.getElementById("perception").value = this._perception;
        document.getElementById("maxForce").value = this._maxForce;
        document.getElementById("maxSpeed").value = this._maxSpeed;
    }

    //returns an array of rocket objects within range of this._perception
    //todo simplify the returned objects to store only neccessary data for performance. Refactor distance to be a property of the simplified object as distance from this or something along those lines.
    _getLocalRockets(allRockets){
        const output = allRockets.filter((currentRocket, index) => {
            const distance = threeDObject.distance(this.position, allRockets[index].position);
            if (distance === 0) {
                return false;
            }
            return (distance <= this._perception);
        })
        return output;
    }

    //steer towards the average heading of local rockets
    _alignment(localRockets) {
        let steerForce = new THREE.Vector3();
        for (let other of localRockets) {
            steerForce.add(other.velocity);
        }
        steerForce.divideScalar(localRockets.length);

        steerForce = this.setMagnitude(steerForce, 1);
        steerForce.sub(this.velocity);
        steerForce = this.limit(steerForce, this._maxForce);
        return steerForce;
    }

    //steer to move toward the average position of local rockets
    _cohesion(localRockets) {
        let avg = new THREE.Vector3();
        for (let other of localRockets) {
            avg.add(other.position);
        }
        avg.divideScalar(localRockets.length);
        let steerForce = avg.sub(this.position);
        steerForce = avg.sub(this.velocity);
        steerForce = this.setMagnitude(steerForce, this._maxSpeed);
        steerForce = this.limit(steerForce, this._maxForce);
        return steerForce;
    }

    //steer to avoid crowding local rockets
    _separation(localRockets) {
        let avg = new THREE.Vector3();
        for (let other of localRockets) {
            const distance = threeDObject.distance(this.position, other.position);
            let diff = new THREE.Vector3(this.position);
            diff.sub(other.position);

            //reduces effect as distance increases
            diff.divideScalar(distance * distance);

            avg.add(diff);
        }
        //avg.divideScalar(localRockets.length);
        let steerForce = avg.sub(this.velocity);
        steerForce = this.setMagnitude(steerForce, this._maxSpeed);
        steerForce = this.limit(steerForce, this._maxForce);
        return steerForce;
    }

    //eventually this will allow them to actually avoid the scene walls, but for now they have some pretty solid warp drive tech.
    _aviodWalls() {
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
    _pointForwards() {
        const m = new THREE.Matrix4();
        m.lookAt(
            new THREE.Vector3(0, 0, 0),
            this.velocity,
            new THREE.Vector3(0, 1, 0)
        )
        this._model.quaternion.setFromRotationMatrix(m);
    }

    _flock(allRocekts) {
        const localRockets = this._getLocalRockets(allRocekts);
        if (localRockets.length === 0) {
            return;
        }
        this._updateScalars();

        this._acceleration.add(this._alignment(localRockets).multiplyScalar(this._alignmentScalar));
        this._acceleration.add(this._cohesion(localRockets).multiplyScalar(this._cohesionScalar));
        this._acceleration.add(this._separation(localRockets).multiplyScalar(this._separationScalar));
    }

    _orbit() {
        this._nextPosition.x = this._orbitRadius * Math.cos(this._theta);
        this._nextPosition.z = this._orbitRadius * Math.sin(this._theta);
        this._theta += this._deltaTheta;
    }

    setOrbit(radius, theta, stepRate, yValue) {
        this.inOrbit = true;
        this._orbitYHeight = yValue;
        this._orbitRadius = radius;
        this._theta = theta;
        this._deltaTheta = 2 * Math.PI / stepRate * .01;
    }

    //called once every threejs animation loop
    update(allRockets) {
        this._acceleration.multiplyScalar(0);
        if (!this.inAnimation && !this.inOrbit) {
            this._flock(allRockets);
            this._position.add(this.limit(this._velocity, this._maxSpeed));
            this._velocity.add(this._acceleration);
            this._aviodWalls();
        } else if (this.inAnimation) {
            this._position.set(this._nextPosition.x, this._nextPosition.y, this._nextPosition.z)
            this._velocity = new THREE.Vector3(this._position.x - this._lastPosition.x, this._position.y - this._lastPosition.y, this._position.z - this._lastPosition.z);
        } else if (this.inOrbit) {
            this._orbit();
            this._position.set(this._nextPosition.x, this._orbitYHeight, this._nextPosition.z)
            this._velocity = new THREE.Vector3(this._position.x - this._lastPosition.x, this._position.y - this._lastPosition.y, this._position.z - this._lastPosition.z);
        }
        this._pointForwards();
        this._lastPosition.set(this.position.x, this.position.y, this.position.z);
        this._model.position.set(this._position.x, this._position.y, this._position.z);
    }

    //todo add debug boolean so this can be skipped if the controls aren't in use.
    _updateScalars() {
        let alignmentValue = document.getElementById("alignment").value;
        alignmentValue = Math.round(alignmentValue * 100) / 100;
        if (alignmentValue != this._alignmentScalar) {
            console.log(`Alignment: ${alignmentValue}`);
        }
        this._alignmentScalar = alignmentValue;

        let cohesionValue = document.getElementById("cohesion").value;
        cohesionValue = Math.round(cohesionValue * 100) / 100;
        if (cohesionValue != this._cohesionScalar) {
            console.log(`Cohesion: ${cohesionValue}`);
        }
        this._cohesionScalar = cohesionValue;

        let separationValue = document.getElementById("separation").value;
        separationValue = Math.round(separationValue * 100) / 100;
        if (separationValue != this._separationScalar) {
            console.log(`separation: ${separationValue}`);
        }
        this._separationScalar = separationValue

        let perceptionValue = document.getElementById("perception").value;
        perceptionValue = Math.round(perceptionValue * 100) / 100;
        if (perceptionValue != this._perception) {
            console.log(`perception: ${perceptionValue}`);
        }
        this._perception = perceptionValue;

        let maxForceValue = document.getElementById("maxForce").value;
        maxForceValue = Math.round(maxForceValue * 100) / 100;
        if (maxForceValue != this._maxForce) {
            console.log(`maxForce: ${maxForceValue}`);
        }
        this._maxForce = maxForceValue;

        let maxSpeedValue = document.getElementById("maxSpeed").value;
        maxSpeedValue = Math.round(maxSpeedValue * 100) / 100;
        if (maxSpeedValue != this._maxSpeed) {
            console.log(`maxSpeed: ${maxSpeedValue}`);
        }
        this._maxSpeed = maxSpeedValue;
    }

    set nextPosition(newPosition) {
        this._nextPosition.set(newPosition.x, newPosition.y, newPosition.z)
    }

    get position() {
        const output = new THREE.Vector3();
        output.copy(this._position);
        return output;
    }

    set position(newPosition) {
        this._position = newPosition;
    }

    get theta() {
        return this._theta;
    }

    get orbitRadius() {
        return this._orbitRadius;
    }

    get orbitYHeight() {
        return this._orbitYHeight;
    }

    get velocity() {
        return this._velocity;
    }

    get model() {
        return this._model;
    }

    setMagnitude(threeVector, magnitude) {
        let output = new p5.Vector(threeVector.x, threeVector.y, threeVector.z);
        output.setMag(magnitude);
        return new THREE.Vector3(output.x, output.y, output.z);
    }

    limit(threeVector, limit) {
        let output = new p5.Vector(threeVector.x, threeVector.y, threeVector.z);
        output.limit(limit);
        return new THREE.Vector3(output.x, output.y, output.z);
    }

    getRocketModel() {
        const model = threeDObject.getRocketModel(this.position, this._scale);
        this._model = model;
        return model;
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.fileName, this._position, this._scale)
            .then(model => {
                this._model = model;
                return model;
            })
    }
}