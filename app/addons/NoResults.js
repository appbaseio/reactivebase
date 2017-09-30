import React from "react";
import PropTypes from 'prop-types';

export default function NoResults(props) {
	return (
		<div className="rbc rbc-noresults">
			{props.defaultText}
		</div>
	);
}

NoResults.propTypes = {
	defaultText: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	])
};

// Default props value
NoResults.defaultProps = {
	defaultText: "No results found."
};
