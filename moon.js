import planet from './planet';
import p5 from 'p5';

export default class Moon extends planet{
    constructor(radiusFromSun, fileName, stepRate, initialTheta, radiusFromPlanet, moonStepRate, initialMoonTheta){
        super(radiusFromSun, fileName, stepRate, initialTheta);

        this._moonTheta = initialMoonTheta;
        this._moonRadius = radiusFromPlanet;
        this._moonDeltaTheta = 2 * Math.PI / moonStepRate;
    }
    orbit() {
        //this just basically, and inefficiently, calculates the orbit of 
        //its planet and then adds another orbit on top of it.
        //the moon of a planet should be initialized with the same values
        //that the planet uses until you hit radiusFromPlanet in the constructor.
        //Is this the best way to implement this? Probably not.
        let newPosition = new p5.Vector(0, 0, 0)
        
        this._theta += this._deltaTheta;
        newPosition.x = this._radius * Math.cos(this._theta);
        newPosition.z = this._radius * Math.sin(this._theta);

        this._moonTheta += this._moonDeltaTheta;
        newPosition.x += this._moonRadius * Math.cos(this._moonTheta);
        newPosition.z += this._moonRadius * Math.sin(this._moonTheta);

        this._position.x = newPosition.x;
        this._position.z = newPosition.z;
    }

    rotate() {
        this._model.rotation.y += .003;
    }
}