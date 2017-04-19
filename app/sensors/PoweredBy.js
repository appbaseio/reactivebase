import React from "react";
const $ = require("jquery");

export default function Poweredby(props) {
	let showMarkup = true;
	const markup = (
		<a href="https://appbase.io/" target="_blank" rel="noopener noreferrer" className="rbc rbc-poweredby">
			<img className="rbc-img-responsive rbc-poweredby-dark" src="https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-dark-logo.svg" alt="Appbase dark" />
			<img className="rbc-img-responsive rbc-poweredby-light" src="https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-logo.svg" alt="Poweredby appbase" />
		</a>
	);
	if(props.container) {
		const height = $(props.container).height() || 0;
		showMarkup = height > 300;
	}
	return showMarkup ? markup : null;
}
