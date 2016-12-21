import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { manager } from './ChannelManager.js';
var helper = require('./helper.js');

export class ReactiveBase extends Component {
	constructor(props, context) {
		super(props);
		this.state = {};
		// this.appbaseRef = helper.setConfigObject(this.props.config);
		// manager.setConfig(this.props.config.appbase);
	}

	getChildContext() {
		return {
			appbaseConfig: {
				username: this.props.username,
				password: this.props.password,
				appname: this.props.appname
			}
		};
	}

	render() {
		return (
			<section className="col s12 col-xs-12" style={{'padding': 0}}>
				{this.props.children}
			</section>
		);
	}
}

ReactiveBase.propTypes = {
	appname: React.PropTypes.string.isRequired,
	username: React.PropTypes.string.isRequired,
	password: React.PropTypes.string.isRequired
};

ReactiveBase.childContextTypes = {
	appbaseConfig: React.PropTypes.any.isRequired
};
