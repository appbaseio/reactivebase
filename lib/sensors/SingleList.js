"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _NativeList = require("./NativeList");

var _NativeList2 = _interopRequireDefault(_NativeList);

var _constants = require("../middleware/constants.js");

var TYPES = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleList = function (_Component) {
	_inherits(SingleList, _Component);

	function SingleList(props, context) {
		_classCallCheck(this, SingleList);

		return _possibleConstructorReturn(this, (SingleList.__proto__ || Object.getPrototypeOf(SingleList)).call(this, props));
	}

	_createClass(SingleList, [{
		key: "render",
		value: function render() {
			return _react2.default.createElement(_NativeList2.default, _extends({}, this.props, {
				multipleSelect: false
			}));
		}
	}]);

	return SingleList;
}(_react.Component);

exports.default = SingleList;


SingleList.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	defaultSelected: _react2.default.PropTypes.string,
	size: _react2.default.PropTypes.number,
	showCount: _react2.default.PropTypes.bool,
	sortBy: _react2.default.PropTypes.string,
	showSearch: _react2.default.PropTypes.bool,
	placeholder: _react2.default.PropTypes.string,
	customQuery: _react2.default.PropTypes.func,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	react: _react2.default.PropTypes.object,
	componentStyle: _react2.default.PropTypes.object
};

// Default props value
SingleList.defaultProps = {
	showCount: true,
	sort: "count",
	size: 100,
	showSearch: false,
	title: null,
	placeholder: "Search",
	componentStyle: {}
};

// context type
SingleList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

SingleList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.KEYWORD,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	showCount: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	componentStyle: TYPES.OBJECT
};