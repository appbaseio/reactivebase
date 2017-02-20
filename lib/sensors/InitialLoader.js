'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.InitialLoader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InitialLoader = exports.InitialLoader = function (_Component) {
	_inherits(InitialLoader, _Component);

	function InitialLoader(props, context) {
		_classCallCheck(this, InitialLoader);

		return _possibleConstructorReturn(this, (InitialLoader.__proto__ || Object.getPrototypeOf(InitialLoader)).call(this, props));
	}

	// render


	_createClass(InitialLoader, [{
		key: 'render',
		value: function render() {
			var cx = (0, _classnames2.default)({
				'rbc-initialloader-active': this.props.queryState,
				'rbc-initialloader-inactive': !this.props.queryState
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-initialloader ' + cx },
				this.props.queryState ? this.props.defaultText : null
			);
		}
	}]);

	return InitialLoader;
}(_react.Component);

InitialLoader.propTypes = {
	defaultText: _react2.default.PropTypes.string,
	queryState: _react2.default.PropTypes.bool
};

// Default props value
InitialLoader.defaultProps = {
	queryState: false,
	defaultText: "loading please wait..."
};