"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Poweredby;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("jquery");

function Poweredby(props) {
	var showMarkup = true;
	var markup = _react2.default.createElement(
		"a",
		{ href: "https://appbase.io/", target: "_blank", rel: "noopener noreferrer", className: "rbc rbc-poweredby" },
		_react2.default.createElement("img", { className: "rbc-img-responsive rbc-poweredby-dark", src: "https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-dark-logo.svg", alt: "Appbase dark" }),
		_react2.default.createElement("img", { className: "rbc-img-responsive rbc-poweredby-light", src: "https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-logo.svg", alt: "Poweredby appbase" })
	);
	if (props.container) {
		var height = $("." + props.container).height() || 0;
		showMarkup = height > 300;
	}
	return showMarkup ? markup : null;
}