import {
	default as React, Component } from 'react';
import classNames from 'classnames';

export class NoResults extends Component {
	constructor(props, context) {
		super(props);
	}

	// render
	render() {
		let cx = classNames({
			'rbc-noresults-active': this.props.visible,
			'rbc-noresults-inactive': !this.props.visible
		});

		return (
			<div className={`rbc rbc-noresults ${cx}`}>
				{this.props.visible ? this.props.defaultText : null}
			</div>
		);
	}
}

NoResults.propTypes = {
	defaultText: React.PropTypes.string,
	visible: React.PropTypes.bool
};

// Default props value
NoResults.defaultProps = {
	visible: false,
	defaultText: "No results found..."
};