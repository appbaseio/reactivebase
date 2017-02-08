import { default as React, Component } from 'react';
import { manager } from './ChannelManager.js';
const Appbase = require('appbase-js');
const helper = require('./helper.js');

export class ReactiveBase extends Component {
	constructor(props, context) {
		super(props);
		this.state = {};
		this.type = this.props.type ? this.props.type : '*';

		this.appbaseRef = new Appbase({
			url: 'https://scalr.api.appbase.io',
			appname: this.props.app,
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
			<section className={"rbc-base col s12 col-xs-12 "+this.props.theme} style={{'padding': 0}}>
				{this.props.children}
			</section>
		);
	}
}

ReactiveBase.propTypes = {
	app: React.PropTypes.string.isRequired,
	username: React.PropTypes.string.isRequired,
	password: React.PropTypes.string.isRequired,
	type: React.PropTypes.string,
	theme: React.PropTypes.string
};

// Default props value
ReactiveBase.defaultProps = {
	theme: "rbc-blue"
}

ReactiveBase.childContextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
