import React, { Component } from 'react';
import manager from './ChannelManager';
const Appbase = require('appbase-js');
const helper = require('./helper.js');

export default class ReactiveBase extends Component {
	constructor(props, context) {
		super(props);
		this.state = {};
		this.type = this.props.type ? this.props.type : "*";

		const appbaseAppAuth = {
			url: "https://scalr.api.appbase.io",
			appname: this.props.app
		};
		if (this.props.credentials) {
			appbaseAppAuth.credentials = this.props.credentials
		} else {
			appbaseAppAuth.username = this.props.username;
			appbaseAppAuth.password = this.props.password;
		}
		this.appbaseRef = new Appbase(appbaseAppAuth);
	}

	getChildContext() {
		return {
			appbaseRef: this.appbaseRef,
			type: this.type
		};
	}

	render() {
		return (
			<section className={"rbc-base col s12 col-xs-12 "+this.props.theme} style={{"padding": 0}}>
				{this.props.children}
			</section>
		);
	}
}

ReactiveBase.propTypes = {
	app: React.PropTypes.string.isRequired,
	username: helper.reactiveBaseValidation,
	password: helper.reactiveBaseValidation,
	credentials: helper.reactiveBaseValidation,
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
