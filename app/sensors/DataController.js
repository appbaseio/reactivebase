import React, { Component } from "react";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";

const helper = require("../middleware/helper");

export default class DataController extends Component {
	constructor(props) {
		super(props);
		this.type = "match";
		this.value = "customValue";
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		this.checkDefault();
	}

	componentWillUpdate() {
		this.checkDefault();
	}

	checkDefault() {
		if (this.props.defaultSelected && this.defaultSelected != this.props.defaultSelected) {
			this.defaultSelected = this.props.defaultSelected;
			setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
		}
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

	setValue(value) {
		const obj = {
			key: this.props.componentId,
			value: value
		};
		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
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
			<div className={`rbc rbc-datacontroller card thumbnail ${cx}`} style={this.props.componentStyle}>
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
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	showUI: React.PropTypes.bool,
	dataLabel: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	customQuery: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	defaultSelected: React.PropTypes.any
};

title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	])

// Default props value
DataController.defaultProps = {
	showUI: false,
	defaultSelected: "default",
	componentStyle: {}
};

// context type
DataController.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

DataController.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	showUI: TYPES.BOOL,
	dataLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT
};
