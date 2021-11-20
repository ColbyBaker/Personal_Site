import p5 from 'p5';
import threeDObject from './threeDObject.js'

export default class Rocket extends threeDObject{
    constructor(initialPosition) {
        super(initialPosition);
        this.scale = new p5.Vector(1, 1.2, 1)
        this.filePath = '/resources/rocketWithoutFlame.glb';
        this.velocity = new p5.Vector(0, 10, 0);
        this.acceleration = new p5.Vector();

    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.filePath, this.position, this.scale);
    }
}