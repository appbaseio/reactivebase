'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ResultStats = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResultStats = exports.ResultStats = function (_Component) {
	_inherits(ResultStats, _Component);

	function ResultStats(props, context) {
		_classCallCheck(this, ResultStats);

		return _possibleConstructorReturn(this, (ResultStats.__proto__ || Object.getPrototypeOf(ResultStats)).call(this, props));
	}

	_createClass(ResultStats, [{
		key: 'defaultText',
		value: function defaultText() {
			if (this.props.setText) {
				return this.props.setText(this.props.total, this.props.took);
			} else {
				return this.props.total + ' results found in ' + this.props.took + 'ms.';
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var cx = (0, _classnames2.default)({
				'rbc-resultstats-active': this.props.visible,
				'rbc-resultstats-inactive': !this.props.visible
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-resultstats col s12 col-xs-12 ' + cx },
				this.props.visible ? this.defaultText() : null
			);
		}
	}]);

	return ResultStats;
}(_react.Component);

ResultStats.propTypes = {
	setText: _react2.default.PropTypes.func,
	visible: _react2.default.PropTypes.bool
};

// Default props value
ResultStats.defaultProps = {
	visible: false
};