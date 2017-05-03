"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Tag;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Tag(props) {
	return _react2.default.createElement(
		"span",
		{ onClick: function onClick() {
				return props.onClick(props.value);
			}, className: "rbc-tag-item col" },
		_react2.default.createElement(
			"a",
			{ href: "javascript:void(0)", className: "close" },
			"\xD7"
		),
		_react2.default.createElement(
			"span",
			null,
			props.value
		)
	);
}