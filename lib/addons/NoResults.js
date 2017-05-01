import React from "react";

export default function NoResults(props) {
	return React.createElement(
		"div",
		{ className: "rbc rbc-noresults" },
		props.defaultText
	);
}

NoResults.propTypes = {
	defaultText: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
};

// Default props value
NoResults.defaultProps = {
	defaultText: "No results found."
};