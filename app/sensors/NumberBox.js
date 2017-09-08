import React, { Component } from "react";
import classNames from "classnames";
const helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";

const TitleComponent = props => (
	<h4 className="rbc-title col s12 col-xs-12">{props.title}</h4>
);

const NumberBoxButtonComponent = (props) => {
	const cx = classNames({
		"rbc-btn-active": props.isActive,
		"rbc-btn-inactive": !props.isActive
	});
	const { type } = props;
	const increment = type == "plus" ? 1 : -1;

	return (
		<button className={`btn rbc-btn ${cx}`} onClick={props.isActive && (() => props.handleChange(increment))}>
			<span className={`fa fa-${type} rbc-icon`} />
		</button>
	);
};

const NumberComponent = (props) => {
	const { label, end, start, handleChange } = props;
	const value = props.value != undefined ? props.value : start;
	const isPlusActive = end != undefined ? value < end : true;
	const isMinusActive = start != undefined ? value > start : true;

	return (
		<div className="rbc-numberbox-container col s12 col-xs-12">
			<div className="rbc-label">{label}</div>
			<div className="rbc-numberbox-btn-container">
				<NumberBoxButtonComponent isActive={isMinusActive} handleChange={handleChange} type="minus" />
				<span className="rbc-numberbox-number">{value}</span>
				<NumberBoxButtonComponent isActive={isPlusActive} handleChange={handleChange} type="plus" />
			</div>
		</div>
	);
};

export default class NumberBox extends Component {
	constructor(props, context) {
		super(props);
		const { focused } = this.props;
		this.urlParams = helper.URLParams.get(this.props.componentId);
		const defaultSelected = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		this.state = {
			currentValue: defaultSelected ? defaultSelected : this.props.data.start,
			focused
		};
		this.type = "term";
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo();
		if(this.urlParams !== null) {
			this.updateQuery(this.urlParams);
		} else {
			setTimeout(this.handleChange.bind(this), 1000);
		}
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		setTimeout(() => {
			const defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
			if ((defaultValue || defaultValue === 0) && (defaultValue !== this.state.currentValue)) {
				this.setState({
					currentValue: defaultValue
				});
			}
			if (nextProps.queryFormat !== this.queryFormat) {
				this.queryFormat = nextProps.queryFormat;
				this.updateQuery();
			}
		}, 300);
	}

	componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	}

	// build query for this sensor only
	customQuery(queryValue) {
		let query = null;
		if (queryValue && (queryValue.value || queryValue.value === 0)) {
			const value = queryValue.value;
			switch (this.props.queryFormat) {
				case "exact":
					query = this.exactQuery(value);
					break;
				case "lte":
					query = this.lteQuery(value);
					break;
				case "gte":
				default:
					query = this.gteQuery(value);
					break;
			}
		}
		return query;
	}

	exactQuery(value) {
		return {
			[this.type]: {
				[this.props.dataField]: value
			}
		};
	}

	gteQuery(value) {
		return {
			range: {
				[this.props.dataField]: {
					gte: value,
					boost: 2.0
				}
			}
		};
	}

	lteQuery(value) {
		return {
			range: {
				[this.props.dataField]: {
					lte: value,
					boost: 2.0
				}
			}
		};
	}

	setQueryInfo() {
		const { componentId, dataField } = this.props;
		const getQuery = (value) => {
			const currentQuery = this.props.customQuery ? this.props.customQuery(value) : this.customQuery(value);
			if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
				this.props.onQueryChange(this.previousQuery, currentQuery);
			}
			this.previousQuery = currentQuery;
			return currentQuery;
		};
		const obj = {
			key: componentId,
			value: {
				queryType: this.type,
				inputData: dataField,
				customQuery: getQuery,
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "NumberBox",
				reactiveId: this.context.reactiveId
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if (data === this.props.componentId) {
				this.setState({
					currentValue: this.props.defaultSelected ? this.props.defaultSelected : this.props.data.start
				}, this.updateQuery.bind(this));
			}
		});
	}

	// handle the input change and pass the value inside sensor info
	handleChange(increment = 0) {
		const { componentId, data } = this.props;
		let { start, end } = data;
		let inputVal = this.state.currentValue;

		start = start != undefined ? start : inputVal - 1;
		end = end != undefined ? end : inputVal + 1;

		if (increment > 0 && inputVal < end) {
			inputVal += 1;
		} else if (increment < 0 && inputVal > start) {
			inputVal -= 1;
		}

		this.setState({
			currentValue: inputVal
		}, this.updateQuery.bind(this));
	}

	updateQuery(currentValue=this.state.currentValue) {
		const obj = {
			key: this.props.componentId,
			value: {
				value: currentValue,
				queryFormat: this.props.queryFormat
			}
		};

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.URLParams.update(this.props.componentId, currentValue, this.props.URLParams);
			helper.selectedSensor.set(obj, true);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value)
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

	render() {
		const { title, data, labelPosition } = this.props;
		const { currentValue } = this.state;
		const ComponentTitle = title ? <TitleComponent title={title} /> : null;
		const cx = classNames({
			"rbc-title-active": title,
			"rbc-title-inactive": !title
		}, this.props.className);
		return (
			<div className={`rbc rbc-numberbox col s12 col-xs-12 card thumbnail ${cx} rbc-label-${labelPosition}`} style={this.props.style}>
				<div className="row">
					{ComponentTitle}
					<NumberComponent
						handleChange={this.handleChange}
						value={currentValue}
						label={data.label}
						start={data.start}
						end={data.end}
					/>
				</div>
			</div>
		);
	}
}

NumberBox.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	data: React.PropTypes.shape({
		start: helper.validateThreshold,
		end: helper.validateThreshold,
		label: React.PropTypes.string
	}),
	defaultSelected: helper.valueValidation,
	labelPosition: React.PropTypes.oneOf(["top", "bottom", "left", "right"]),
	customQuery: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	style: React.PropTypes.object,
	queryFormat: React.PropTypes.oneOf(["exact", "gte", "lte"]),
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	onQueryChange: React.PropTypes.func,
	filterLabel: React.PropTypes.string,
	className: React.PropTypes.string
};

NumberBox.defaultProps = {
	style: {},
	queryFormat: "gte",
	URLParams: false,
	showFilter: true
};

// context type
NumberBox.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

NumberBox.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.NUMBER,
	labelPosition: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	queryFormat: TYPES.STRING,
	onQueryChange: TYPES.FUNCTION,
	URLParams: TYPES.BOOLEAN,
	className: TYPES.STRING
};
