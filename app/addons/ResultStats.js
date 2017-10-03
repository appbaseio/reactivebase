import React from "react";
import PropTypes from 'prop-types';

export default function ResultStats(props) {
	if (props.onResultStats) {
		return (
			<div className={"rbc rbc-resultstats col s12 col-xs-12"}>
				{props.onResultStats(props.total, props.took)}
			</div>
		);
	}
	return (
		<div className={"rbc rbc-resultstats col s12 col-xs-12"}>
			{props.total} results found in {props.took} ms
		</div>
	);
}

ResultStats.propTypes = {
	onResultStats: PropTypes.func
};
