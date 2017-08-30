import React, { Component } from "react";
import manager from "./ChannelManager";
const Appbase = require("appbase-js");
const helper = require("./helper.js");

export default class ReactiveBase extends Component {
	constructor(props, context) {
		super(props);

		this.state = {};
		this.type = this.props.type ? this.props.type : "*";

		const credentials = this.props.url && this.props.url.trim() !== "" && !this.props.credentials
			? "test:test"
			: this.props.credentials;

		this.appbaseRef = new Appbase({
			url: this.props.url && this.props.url.trim() !== "" ? this.props.url : "https://scalr.api.appbase.io",
			appname: this.props.app,
			credentials: credentials,
			type: this.type
		});

		this.appbaseCrdentials = {
			url: this.props.url && this.props.url.trim() !== "" ? this.props.url : "https://scalr.api.appbase.io",
			credentials: credentials,
			appname: this.props.app,
			type: this.type
		};

		this.reactiveId = helper.RecactivebaseComponents.length;
		helper.RecactivebaseComponents[this.reactiveId] = [];
	}

	componentWillMount() {
		this.setupComponents(this.props.children);
	}

	componentWillReceiveProps(nextProps) {
		this.setupComponents(nextProps.children);
	}

	setupComponents(children) {
		this.components = [];
		this.getComponents(children);
		helper.RecactivebaseComponents[this.reactiveId] = this.components;
	}

	getComponents(children) {
		children = Array.isArray(children) ? children : [children];
		children.forEach(child => {
			if(child && child.props && child.props.componentId && child.props.showFilter !== false) {
				this.components.push({
					component: child.type.name,
					componentId: child.props.componentId
				});
			}
			if(child && child.props && child.props.children) {
				this.getComponents(child.props.children);
			}
		});
	}

	getChildContext() {
		return {
			appbaseRef: this.appbaseRef,
			type: this.type,
			app: this.props.app,
			appbaseCrdentials: this.appbaseCrdentials,
			reactiveId: this.reactiveId
		};
	}

	render() {
		return (
			<section className={`rbc-base col s12 col-xs-12 ${this.props.theme}`} style={{ padding: 0 }}>
				{this.props.children}
			</section>
		);
	}
}

ReactiveBase.propTypes = {
	url: React.PropTypes.string,
	app: React.PropTypes.string.isRequired,
	credentials: helper.reactiveBaseValidation,
	type: React.PropTypes.string,
	theme: React.PropTypes.string
};

// Default props value
ReactiveBase.defaultProps = {
	theme: "rbc-blue"
};

ReactiveBase.childContextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	app: React.PropTypes.any,
	appbaseCrdentials: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};
