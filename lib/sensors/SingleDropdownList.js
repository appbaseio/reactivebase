'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SingleDropdownList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DropdownList = require('./DropdownList');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleDropdownList = exports.SingleDropdownList = function (_Component) {
	_inherits(SingleDropdownList, _Component);

	function SingleDropdownList(props, context) {
		_classCallCheck(this, SingleDropdownList);

		return _possibleConstructorReturn(this, (SingleDropdownList.__proto__ || Object.getPrototypeOf(SingleDropdownList)).call(this, props));
	}

	_createClass(SingleDropdownList, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(_DropdownList.DropdownList, _extends({}, this.props, {
				multipleSelect: false
			}));
		}
	}]);

	return SingleDropdownList;
}(_react.Component);

SingleDropdownList.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.string,
	showCount: _react2.default.PropTypes.bool,
	size: _react2.default.PropTypes.number,
	sortBy: _react2.default.PropTypes.oneOf(['asc', 'desc', 'count']),
	placeholder: _react2.default.PropTypes.string
};

// Default props value
SingleDropdownList.defaultProps = {
	showCount: true,
	sortBy: 'count',
	size: 100,
	title: null
};

// context type
SingleDropdownList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};