"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = NoResults;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NoResults(props) {
	return _react2.default.createElement(
		"div",
		{ className: "rbc rbc-noresults" },
		props.defaultText
	);
}

NoResults.propTypes = {
	defaultText: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element])
};

// Default props value
NoResults.defaultProps = {
	defaultText: "No results found."
};