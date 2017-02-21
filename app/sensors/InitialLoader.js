import {
	default as React, Component } from 'react';
import classNames from 'classnames';

export class InitialLoader extends Component {
	constructor(props, context) {
		super(props);
	}

	// render
	render() {
		let cx = classNames({
			'rbc-initialloader-active': this.props.queryState,
			'rbc-initialloader-inactive': !this.props.queryState
		});

		return (
			<div className={`rbc rbc-initialloader ${cx}`}>
				{this.props.queryState ? this.props.defaultText : null}
			</div>
		);
	}
}

InitialLoader.propTypes = {
	defaultText: React.PropTypes.string,
	queryState: React.PropTypes.bool
};

// Default props value
InitialLoader.defaultProps = {
	queryState: false,
	defaultText: "Initializing data.."
};
