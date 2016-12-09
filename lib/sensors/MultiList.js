'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MultiList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _NativeList = require('./NativeList');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiList = exports.MultiList = function (_Component) {
	_inherits(MultiList, _Component);

	function MultiList(props, context) {
		_classCallCheck(this, MultiList);

		return _possibleConstructorReturn(this, (MultiList.__proto__ || Object.getPrototypeOf(MultiList)).call(this, props));
	}

	_createClass(MultiList, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(_NativeList.NativeList, _extends({}, this.props, {
				multipleSelect: true
			}));
		}
	}]);

	return MultiList;
}(_react.Component);

MultiList.propTypes = {
	sensorId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.string,
	defaultSelected: _react2.default.PropTypes.array,
	size: _react2.default.PropTypes.number,
	showCount: _react2.default.PropTypes.bool,
	sortBy: _react2.default.PropTypes.string,
	showSearch: _react2.default.PropTypes.bool,
	searchPlaceholder: _react2.default.PropTypes.string
};
// Default props value
MultiList.defaultProps = {
	showCount: true,
	sort: 'count',
	size: 100,
	showSearch: false,
	title: null,
	searchPlaceholder: 'Search',
	defaultStyle: {
		height: '500px',
		overflow: 'auto'
	}
};

// context type
MultiList.contextTypes = {
	appbaseConfig: _react2.default.PropTypes.any.isRequired
};