import React, { Component } from 'react';
import classNames from 'classnames';

export default class ResultStats extends Component {
	constructor(props, context) {
		super(props);
	}

	defaultText() {
		if (this.props.setText) {
			return this.props.setText(this.props.total, this.props.took);
		} else {
			return `${this.props.total} results found in ${this.props.took}ms`;
		}
	}

	render() {
		let cx = classNames({
			'rbc-resultstats-active': this.props.visible,
			'rbc-resultstats-inactive': !this.props.visible
		});

		return (
			<div className={`rbc rbc-resultstats col s12 col-xs-12 ${cx}`}>
				{this.defaultText()}
			</div>
		);
	}
}

ResultStats.propTypes = {
	setText: React.PropTypes.func
};
