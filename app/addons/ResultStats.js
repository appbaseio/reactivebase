import React, { Component } from "react";
import classNames from "classnames";

export default class ResultStats extends Component {
	constructor(props, context) {
		super(props);
	}

	defaultText() {
		if (this.props.onResultStats) {
			return this.props.onResultStats(this.props.total, this.props.took);
		}
		return `${this.props.total} results found in ${this.props.took} ms`;
	}

	render() {
		return (
			<div className={"rbc rbc-resultstats col s12 col-xs-12"}>
				{this.defaultText()}
			</div>
		);
	}
}

ResultStats.propTypes = {
	onResultStats: React.PropTypes.func
};
