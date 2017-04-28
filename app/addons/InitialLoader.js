import React from "react";

export default function InitialLoader(props) {
	return (
		<div className="rbc rbc-initialloader">
			{props.defaultText}
		</div>
	);
}

InitialLoader.propTypes = {
	defaultText: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	])
};

// Default props value
InitialLoader.defaultProps = {
	defaultText: "Initializing data.."
};
