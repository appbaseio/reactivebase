"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = InitialLoader;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function InitialLoader(props) {
	return _react2.default.createElement(
		"div",
		{ className: "rbc rbc-initialloader" },
		props.defaultText
	);
}

InitialLoader.propTypes = {
	defaultText: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element])
};

// Default props value
InitialLoader.defaultProps = {
	defaultText: "Initializing data.."
};