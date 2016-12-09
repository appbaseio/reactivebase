'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AppbaseReactiveMap = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _ChannelManager = require('./ChannelManager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('./helper.js');

var AppbaseReactiveMap = exports.AppbaseReactiveMap = function (_Component) {
	_inherits(AppbaseReactiveMap, _Component);

	function AppbaseReactiveMap(props, context) {
		_classCallCheck(this, AppbaseReactiveMap);

		var _this = _possibleConstructorReturn(this, (AppbaseReactiveMap.__proto__ || Object.getPrototypeOf(AppbaseReactiveMap)).call(this, props));

		_this.state = {};
		_this.appbaseRef = helper.setConfigObject(_this.props.config);
		_ChannelManager.manager.setConfig(_this.props.config.appbase);
		return _this;
	}

	_createClass(AppbaseReactiveMap, [{
		key: 'getChildContext',
		value: function getChildContext() {
			return { appbaseConfig: this.props.config };
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'section',
				{ className: 'col s12 col-xs-12', style: { 'padding': 0 } },
				this.props.children
			);
		}
	}]);

	return AppbaseReactiveMap;
}(_react.Component);

AppbaseReactiveMap.defaultProps = {
	config: _react2.default.PropTypes.any.isRequired
};

AppbaseReactiveMap.childContextTypes = {
	appbaseConfig: _react2.default.PropTypes.any.isRequired
};