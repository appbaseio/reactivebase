import React, { Component } from "react";
import classNames from "classnames";
const helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";

export default class TextField extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			currentValue: ""
		};
		this.type = "match";
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
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
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	customQuery(value) {
		return {
			term: {
				[this.props.appbaseField]: value
			}
		};
	}

	// handle the input change and pass the value inside sensor info
	handleChange(event) {
		const inputVal = event.target.value;
		this.setValue(inputVal);
	}

	setValue(inputVal) {
		this.setState({
			currentValue: inputVal
		});
		const obj = {
			key: this.props.componentId,
			value: inputVal
		};

		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// render
	render() {
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder
		});

		return (
			<div className={`rbc rbc-textfield col s12 col-xs-12 card thumbnail ${cx}`}>
				{title}
				<div className="rbc-input-container col s12 col-xs-12">
					<input className="rbc-input" type="text" onChange={this.handleChange} placeholder={this.props.placeholder} value={this.state.currentValue} />
				</div>
			</div>
		);
	}
}

TextField.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	defaultSelected: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	customQuery: React.PropTypes.func
};

// Default props value
TextField.defaultProps = {};

// context type
TextField.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

TextField.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION
};
