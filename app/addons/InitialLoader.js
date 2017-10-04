import React from "react";
import PropTypes from "prop-types";

export default function InitialLoader(props) {
	return (
		<div className="rbc rbc-initialloader">
			{props.defaultText}
		</div>
	);
}

InitialLoader.propTypes = {
	defaultText: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	])
};

// Default props value
InitialLoader.defaultProps = {
	defaultText: "Initializing data.."
};
