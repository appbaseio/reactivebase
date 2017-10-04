import React, { Component } from "react";
import PropTypes from "prop-types";
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
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId) : null;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo(this.props);
		this.listenFilter();
	}

	componentDidMount() {
		this.checkDefault(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.checkDefault(nextProps);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.setValue(this.state.currentValue);
		}
	}

	componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if (data === this.props.componentId) {
				this.valueChange(null);
			}
		});
	}

	checkDefault(props) {
		this.urlParams = props.URLParams ? helper.URLParams.get(this.props.componentId) : null;
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.valueChange(defaultValue);
	}

	valueChange(defaultValue) {
		if (this.defaultSelected != defaultValue) {
			this.defaultSelected = defaultValue;
			this.setValue(this.defaultSelected);
		}
	}

	// set the query type and input data
	setQueryInfo(props) {
		const getQuery = (value) => {
			const currentQuery = props.customQuery ? props.customQuery(value) : this.customQuery(value);
			if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
				this.props.onQueryChange(this.previousQuery, currentQuery);
			}
			this.previousQuery = currentQuery;
			return currentQuery;
		};
		const obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.dataField,
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "TextField",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	customQuery(value) {
		return {
			[this.type]: {
				[this.props.dataField]: value
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
		this.defaultSelected = inputVal;
		const nextValue = obj.value ? obj.value : null;

		const execQuery = () => {
			const isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(nextValue);
			}
			if (this.props.URLParams) {
				helper.URLParams.update(this.props.componentId, inputVal, this.props.URLParams);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(nextValue)
			.then(() => {
				execQuery();
			})
			.catch((e) => {
				console.warn(`${this.props.componentId} - beforeValueChange rejected the promise with`, e);
			});
		} else {
			execQuery();
		}
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
		}, this.props.className);

		return (
			<div className={`rbc rbc-textfield col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
				{title}
				<div className="rbc-input-container col s12 col-xs-12">
					<input
						className="rbc-input"
						type="text"
						onChange={this.handleChange}
						placeholder={this.props.placeholder}
						value={this.state.currentValue ? this.state.currentValue : ""}
						onBlur={this.props.onBlur}
						onFocus={this.props.onFocus}
						onKeyPress={this.props.onKeyPress}
						onKeyDown={this.props.onKeyDown}
						onKeyUp={this.props.onKeyUp}
						autoFocus={this.props.autoFocus}
					/>
				</div>
			</div>
		);
	}
}

TextField.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	defaultSelected: PropTypes.string,
	placeholder: PropTypes.string,
	customQuery: PropTypes.func,
	beforeValueChange: PropTypes.func,
	onValueChange: PropTypes.func,
	style: PropTypes.object,
	URLParams: PropTypes.bool,
	onQueryChange: PropTypes.func,
	showFilter: PropTypes.bool,
	filterLabel: PropTypes.string,
	className: PropTypes.string,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	onKeyPress: PropTypes.func,
	onKeyDown: PropTypes.func,
	onKeyUp: PropTypes.func,
	autoFocus: PropTypes.bool
};

// Default props value
TextField.defaultProps = {
	style: {},
	URLParams: false,
	showFilter: true,
	autoFocus: false
};

// context type
TextField.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired,
	reactiveId: PropTypes.number
};

TextField.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.STRING,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING,
	onBlur: TYPES.FUNCTION,
	onFocus: TYPES.FUNCTION,
	onKeyPress: TYPES.FUNCTION,
	onKeyDown: TYPES.FUNCTION,
	onKeyUp: TYPES.FUNCTION,
	autoFocus: TYPES.BOOLEAN
};
