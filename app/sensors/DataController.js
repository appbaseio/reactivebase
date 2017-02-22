import React, { Component } from "react";
import classNames from "classnames";
import { manager } from "../middleware/ChannelManager";
import * as TYPES from "../middleware/constants";

const helper = require("../middleware/helper");

export default class DataController extends Component {
	constructor(props) {
		super(props);
		this.type = "match";
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		this.createChannel();
	}

	// set the query type and input data
	setQueryInfo() {
		const valObj = {
			queryType: this.type,
			inputData: this.props.appbaseField
		};
		if (this.props.customQuery) {
			valObj.customQuery = this.props.customQuery;
		}
		const obj = {
			key: this.props.componentId,
			value: valObj
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	setValue() {
		const obj = {
			key: this.props.componentId,
			value: this.props.value
		};
		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// use this only if want to create actuators
	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		if (this.props.react) {
			const react = this.props.react ? this.props.react : {};
			manager.create(this.context.appbaseRef, this.context.type, react);
		}
		setTimeout(this.setValue.bind(this), 100);
	}

	// render
	render() {
		let title = null,
			dataLabel = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		if (this.props.dataLabel) {
			dataLabel = (<span className="rbc-datalabel col s12 col-xs-12">{this.props.dataLabel}</span>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-querylabel-active": this.props.dataLabel,
			"rbc-querylabel-inactive": !this.props.dataLabel
		});

		return (
			<div className={`rbc rbc-datacontroller card thumbnail ${cx}`}>
				{
				this.props.showUI ?
				(
					<div>
						{title}
						{dataLabel}
					</div>
				) : null
			}
			</div>
		);
	}
}

DataController.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.string,
	showUI: React.PropTypes.bool,
	dataLabel: React.PropTypes.string,
	value: React.PropTypes.any,
	customQuery: React.PropTypes.func,
	react: React.PropTypes.object
};

// Default props value
DataController.defaultProps = {
	showUI: false,
	value: "customValue"
};

// context type
DataController.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

DataController.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	showUI: TYPES.BOOL,
	dataLabel: TYPES.STRING
};
