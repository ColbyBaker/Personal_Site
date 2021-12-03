import p5 from 'p5';
import threeDObject from './threeDObject.js'

export default class Rocket extends threeDObject{
    constructor(initialPosition) {
        super(initialPosition);

        this._scale = new p5.Vector(.8, 1, .8)
        this.fileName = 'rocketWithoutFlame.glb';
        this._model;

        this._sceneMin = -100;
        this._sceneMax = 100;

        this._velocity = new p5.Vector.random3D();
        this._velocity.setMag(1);
        this._acceleration = new p5.Vector();

        this._perception = 20;
        this._maxForce = .01;
        this._maxSpeed = .8;

        this._alignmentScaler = 1.7;
        this._cohesionScaler = .5;
        this._separationScaler = .2;

        document.getElementById("alignment").value = this._alignmentScaler;
        document.getElementById("cohesion").value = this._cohesionScaler;
        document.getElementById("separation").value = this._separationScaler;

        document.getElementById("perception").value = this._perception;
        document.getElementById("maxForce").value = this._maxForce;
        document.getElementById("maxSpeed").value = this._maxSpeed;
    }

    //returns an array of rocket objects within range of this._perception
    //todo simplify the returned objects to store only neccessary data for performance. Refactor distance to be a property of the simplified object as distance from this or something along those lines.
    getLocalRockets(allRockets){
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
    alignment(localRockets) {
        let steerForce = new p5.Vector();
        for (let other of localRockets) {
            steerForce.add(other.velocity);
        }
        //creates an average
        steerForce.div(localRockets.length);

        steerForce.setMag(this._maxSpeed);
        steerForce.sub(this.velocity);
        steerForce.limit(this._maxForce);
        return steerForce;
    }

    //steer to move toward the average position of local rockets
    cohesion(localRockets) {
        let avg = new p5.Vector();
        for (let other of localRockets) {
            avg.add(other.position);
        }
        avg.div(localRockets.length);
        let steerForce = avg.sub(this.position);
        steerForce = avg.sub(this.velocity);
        steerForce.setMag(this._maxSpeed);
        steerForce.limit(this._maxForce);
        return steerForce;
    }

    //steer to avoid crowding local rockets
    separation(localRockets) {
        let avg = new p5.Vector();
        for (let other of localRockets) {
            const distance = threeDObject.distance(this.position, other.position);
            let diff = new p5.Vector(this.position);
            diff.sub(other.position);

            //reduces effect as distance increases
            diff.div(distance * distance);

            avg.add(diff);
        }
        avg.div(localRockets.length);
        let steerForce = avg.sub(this.velocity);
        steerForce.setMag(this._maxSpeed);
        steerForce.limit(this._maxForce);
        return steerForce;
    }

    flock(allRocekts) {
        const localRockets = this.getLocalRockets(allRocekts);
        if (localRockets.length === 0) {
            return;
        }
        this.updateScalers();

        this._acceleration.add(this.alignment(localRockets).mult(this._alignmentScaler));
        this._acceleration.add(this.cohesion(localRockets).mult(this._cohesionScaler));
        this._acceleration.add(this.separation(localRockets).mult(this._separationScaler));
    }

    //eventually this will allow them to actually avoid the walls, but for now they have smome warp drive stuff.
    aviodWalls() {
        //make the rockets avoid walls idk
        if (this.position.x > this._sceneMax) {
            this.position.x = this._sceneMin;
          } else if (this.position.x < this._sceneMin) {
            this.position.x = this._sceneMax;
          }
          if (this.position.y > this._sceneMax) {
            this.position.y = this._sceneMin;
          } else if (this.position.y < this._sceneMin) {
            this.position.y = this._sceneMax;
          }
          if (this.position.z > this._sceneMax) {
            this.position.z = this._sceneMin;
          } else if (this.position.z < this._sceneMin) {
            this.position.z = this._sceneMax;
          }
    }

    update(allRockets) {
        this._acceleration.mult(0);
        this.flock(allRockets);

        this._position.add(this._velocity.limit(this._maxSpeed));
        this._velocity.add(this._acceleration);

        this.aviodWalls();
        this._model.position.set(this._position.x, this._position.y, this._position.z);
    }

    updateScalers() {
        let alignmentValue = document.getElementById("alignment").value;
        alignmentValue = Math.round(alignmentValue * 100) / 100;
        if (alignmentValue != this._alignmentScaler) {
            console.log(`Alignment: ${alignmentValue}`);
        }
        this._alignmentScaler = alignmentValue;

        let cohesionValue = document.getElementById("cohesion").value;
        cohesionValue = Math.round(cohesionValue * 100) / 100;
        if (cohesionValue != this._cohesionScaler) {
            console.log(`Cohesion: ${cohesionValue}`);
        }
        this._cohesionScaler = cohesionValue;

        let separationValue = document.getElementById("separation").value;
        separationValue = Math.round(separationValue * 100) / 100;
        if (separationValue != this._separationScaler) {
            console.log(`separation: ${separationValue}`);
        }
        this._separationScaler = separationValue

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

    get position() {
        return this._position;
    }

    get velocity() {
        return this._velocity;
    }

    get model() {
        return this._model;
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.fileName, this._position, this._scale)
            .then(model => {
                this._model = model;
                return model;
            })
    }
}