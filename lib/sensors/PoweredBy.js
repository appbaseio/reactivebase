import React from "react";

var Poweredby = function Poweredby() {
	return React.createElement(
		"a",
		{ href: "https://appbase.io/", target: "_blank", rel: "noopener noreferrer", className: "rbc rbc-poweredby" },
		React.createElement("img", { className: "rbc-img-responsive rbc-poweredby-dark", src: "https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-dark-logo.svg", alt: "Appbase dark" }),
		React.createElement("img", { className: "rbc-img-responsive rbc-poweredby-light", src: "https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-logo.svg", alt: "Poweredby appbase" })
	);
};

export default Poweredby;