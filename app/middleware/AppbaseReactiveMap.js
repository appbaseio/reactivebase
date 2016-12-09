import { default as React, Component } from 'react';
import { render } from 'react-dom';
import {manager} from './ChannelManager.js';
var helper = require('./helper.js');

export class AppbaseReactiveMap extends Component {
	constructor(props, context) {
		super(props);
		this.state = {};
		this.appbaseRef = helper.setConfigObject(this.props.config);
		manager.setConfig(this.props.config.appbase);
	}
	getChildContext() {
		return { appbaseConfig: this.props.config };
	}
	render() {
		return (
			<section className="col s12 col-xs-12" style={{'padding': 0}}>
				{this.props.children}
			</section>
		);
	}
}

AppbaseReactiveMap.defaultProps = {
	config: React.PropTypes.any.isRequired,
};

AppbaseReactiveMap.childContextTypes = {
	appbaseConfig: React.PropTypes.any.isRequired
};