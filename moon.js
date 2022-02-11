var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import planet from './planet';
import p5 from 'p5';

var Moon = function (_planet) {
    _inherits(Moon, _planet);

    function Moon(radiusFromSun, fileName, stepRate, initialTheta, radiusFromPlanet, moonStepRate, initialMoonTheta) {
        _classCallCheck(this, Moon);

        var _this = _possibleConstructorReturn(this, (Moon.__proto__ || Object.getPrototypeOf(Moon)).call(this, radiusFromSun, fileName, stepRate, initialTheta));

        _this._moonTheta = initialMoonTheta;
        _this._moonRadius = radiusFromPlanet;
        _this._moonDeltaTheta = 2 * Math.PI / moonStepRate;
        return _this;
    }

    _createClass(Moon, [{
        key: 'orbit',
        value: function orbit() {
            //This just basically, and inefficiently, calculates the orbit of it's planet and then adds another orbit on top of it.
            //The moon of a planet should be initialized with the same values that the planet uses until you hit radiusFromPlanet in the constructor.
            //Is this the best way to implement this? Probably not, but hey, we're here.
            var newPosition = new p5.Vector(0, 0, 0);

            this._theta += this._deltaTheta;
            newPosition.x = this._radius * Math.cos(this._theta);
            newPosition.z = this._radius * Math.sin(this._theta);

            this._moonTheta += this._moonDeltaTheta;
            newPosition.x += this._moonRadius * Math.cos(this._moonTheta);
            newPosition.z += this._moonRadius * Math.sin(this._moonTheta);

            this._position.x = newPosition.x;
            this._position.z = newPosition.z;
        }
    }, {
        key: 'rotate',
        value: function rotate() {
            this._model.rotation.y += .003;
        }
    }]);

    return Moon;
}(planet);

export default Moon;