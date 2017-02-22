import React, { Component } from 'react';

export default class InitialLoader extends Component {
	constructor(props, context) {
		super(props);
	}

	// render
	render() {
		return (
			<div className={`rbc rbc-initialloader`}>
				{this.props.defaultText}
			</div>
		);
	}
}

InitialLoader.propTypes = {
	defaultText: React.PropTypes.string,
};

// Default props value
InitialLoader.defaultProps = {
	defaultText: "Initializing data.."
};
