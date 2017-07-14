import React from "react";

export default function ResultStats(props) {
	if (props.onResultStats) {
		return React.createElement(
			"div",
			{ className: "rbc rbc-resultstats col s12 col-xs-12" },
			props.onResultStats(props.total, props.took)
		);
	}
	return React.createElement(
		"div",
		{ className: "rbc rbc-resultstats col s12 col-xs-12" },
		props.total,
		" results found in ",
		props.took,
		" ms"
	);
}

ResultStats.propTypes = {
	onResultStats: React.PropTypes.func
};