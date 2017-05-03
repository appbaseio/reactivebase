import React from "react";

export default function InitialLoader(props) {
	return React.createElement(
		"div",
		{ className: "rbc rbc-initialloader" },
		props.defaultText
	);
}

InitialLoader.propTypes = {
	defaultText: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
};

// Default props value
InitialLoader.defaultProps = {
	defaultText: "Initializing data.."
};