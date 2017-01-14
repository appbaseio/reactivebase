import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { manager } from './ChannelManager.js';
var helper = require('./helper.js');

export class ReactiveBase extends Component {
	constructor(props, context) {
		super(props);
		this.state = {};
		this.type = this.props.type ? this.props.type : '*';

		this.appbaseRef = new Appbase({
			url: 'https://scalr.api.appbase.io',
			appname: this.props.appname,
			username: this.props.username,
			password: this.props.password
		});
	}

	getChildContext() {
		return {
			appbaseRef: this.appbaseRef,
			type: this.type
		};
	}

	render() {
		return (
			<section className={"col s12 col-xs-12 "+this.props.theme} style={{'padding': 0}}>
				{this.props.children}
			</section>
		);
	}
}

ReactiveBase.propTypes = {
	appname: React.PropTypes.string.isRequired,
	username: React.PropTypes.string.isRequired,
	password: React.PropTypes.string.isRequired,
	type: React.PropTypes.string,
	theme: React.PropTypes.string
};

// Default props value
ReactiveBase.defaultProps = {
	theme: "rbc-dark"
}

ReactiveBase.childContextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
