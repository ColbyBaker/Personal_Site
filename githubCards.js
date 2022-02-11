'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { githubAPI } from "./Util/API";

var repos = ['payroll-frontend', 'Atlas', 'jamming', 'ravenous', 'Personal_Site', 'BossMachine'];

var RepoCard = function (_React$Component) {
  _inherits(RepoCard, _React$Component);

  function RepoCard(props) {
    _classCallCheck(this, RepoCard);

    var _this = _possibleConstructorReturn(this, (RepoCard.__proto__ || Object.getPrototypeOf(RepoCard)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(RepoCard, [{
    key: 'render',
    value: function render() {
      console.log(this.props);
      return React.createElement('div', { id: 'repo-card' });
    }
  }]);

  return RepoCard;
}(React.Component);

var GithubCards = function (_React$Component2) {
  _inherits(GithubCards, _React$Component2);

  function GithubCards(props) {
    _classCallCheck(this, GithubCards);

    var _this2 = _possibleConstructorReturn(this, (GithubCards.__proto__ || Object.getPrototypeOf(GithubCards)).call(this, props));

    _this2.state = {
      repos: []
    };
    return _this2;
  }

  _createClass(GithubCards, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      repos.forEach(function (currentRepo) {
        githubAPI.getRepo(currentRepo).then(function (data) {
          _this3.setState({
            repos: [].concat(_toConsumableArray(_this3.state.repos), [data])
          });
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var githubCards = void 0;
      if (this.state.repos.length > 0) {
        githubCards = this.state.repos.map(currentRepo);
      }
      return React.createElement('div', { id: 'github-cards' });
    }
  }]);

  return GithubCards;
}(React.Component);

var domContainer = document.querySelector('#react-github-cards');
ReactDOM.render(React.createElement(GithubCards, null), domContainer);