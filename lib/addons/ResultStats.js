"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ResultStats;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ResultStats(props) {
	if (props.onResultStats) {
		return _react2.default.createElement(
			"div",
			{ className: "rbc rbc-resultstats col s12 col-xs-12" },
			props.onResultStats(props.total, props.took)
		);
	}
	return _react2.default.createElement(
		"div",
		{ className: "rbc rbc-resultstats col s12 col-xs-12" },
		props.total,
		" results found in ",
		props.took,
		" ms"
	);
}

ResultStats.propTypes = {
	onResultStats: _react2.default.PropTypes.func
};