import p5 from 'p5';
import threeDObject from './threeDObject.js'

export default class Rocket extends threeDObject{
    constructor(initialPosition) {
        super(initialPosition);
        this.scale = new p5.Vector(.8, 1, .8)
        this.fileName = 'rocketWithoutFlame.glb';
        
        this.velocity = new p5.Vector(0, 10, 0);
        this.acceleration = new p5.Vector();

    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
    }

    asyncLoadModel() {
        return super.asyncLoadModel(this.fileName, this.position, this.scale);
    }
}