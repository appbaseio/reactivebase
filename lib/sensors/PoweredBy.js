import React from "react";
var $ = require("jquery");

export default function Poweredby(props) {
	var showMarkup = true;
	var markup = React.createElement(
		"a",
		{ href: "https://appbase.io/", target: "_blank", rel: "noopener noreferrer", className: "rbc rbc-poweredby" },
		React.createElement("img", { className: "rbc-img-responsive rbc-poweredby-dark", src: "https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-dark-logo.svg", alt: "Appbase dark" }),
		React.createElement("img", { className: "rbc-img-responsive rbc-poweredby-light", src: "https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-logo.svg", alt: "Poweredby appbase" })
	);
	if (props.container) {
		var height = $("." + props.container).height() || 0;
		showMarkup = height > 300;
	}
	return showMarkup ? markup : null;
}