import React, { Component } from "react";
import PropTypes from "prop-types";
import { SingleDatePicker } from "react-dates";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";
import moment from "moment";
import momentPropTypes from "react-moment-proptypes";

const helper = require("../middleware/helper");

export default class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentValue: this.props.defaultSelected,
			focused: this.props.focused
		};
		this.type = "range";
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId) : null;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo(this.props);
		if (this.urlParams !== null) {
			this.handleChange(moment(this.urlParams), true);
		}
		this.checkDefault();
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.checkDefault();
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleChange(this.state.currentValue);
		}
		if (this.props.focused !== nextProps.focused) {
			this.handleFocus(nextProps.focused);
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
				this.defaultDate = null;
				this.handleChange(this.defaultDate);
			}
		});
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
				component: "DatePicker"
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	checkDefault() {
		if (this.urlParams !== null && this.props.queryFormat && helper.dateFormat[this.props.queryFormat] && moment(this.defaultDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(this.urlParams).format(helper.dateFormat[this.props.queryFormat])) {
			this.defaultDate = moment(this.urlParams);
			setTimeout(this.handleChange.bind(this, this.defaultDate), 1000);
		} else if (this.props.defaultSelected && this.props.queryFormat && helper.dateFormat[this.props.queryFormat] && moment(this.defaultDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(this.props.defaultSelected).format(helper.dateFormat[this.props.queryFormat])) {
			this.defaultDate = this.props.defaultSelected;
			setTimeout(this.handleChange.bind(this, this.defaultDate), 1000);
		}
	}

	// build query for this sensor only
	customQuery(value) {
		let query = null;
		if (value && this.props.queryFormat && helper.dateFormat[this.props.queryFormat]) {
			query = {
				range: {
					[this.props.dataField]: {
						gte: moment(value).subtract(24, "hours").format(helper.dateFormat[this.props.queryFormat]),
						lte: moment(value).format(helper.dateFormat[this.props.queryFormat])
					}
				}
			};
		}
		return query;
	}

	// handle the input change and pass the value inside sensor info
	handleChange(inputVal) {
		this.setState({
			currentValue: inputVal
		});
		const obj = {
			key: this.props.componentId,
			value: inputVal
		};

		const execQuery = () => {
			const isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			if (this.props.URLParams) {
				helper.URLParams.update(this.props.componentId, inputVal, this.props.URLParams);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
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

	// handle focus
	handleFocus(focus) {
		this.setState({
			focused: focus
		});
	}

	// allow all dates
	allowAllDates() {
		let outsideObj;
		if (this.props.allowAllDates) {
			outsideObj = {
				isOutsideRange: () => false
			};
		}

		return outsideObj;
	}

	// render
	render() {
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title
		}, this.props.className);
		return (
			<div className={`rbc rbc-datepicker col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
				{title}
				<div className="col s12 col-xs-12">
					<SingleDatePicker
						date={this.state.currentValue}
						placeholder={this.props.placeholder}
						focused={this.state.focused}
						numberOfMonths={this.props.numberOfMonths}
						{...this.props.extra}
						{...this.allowAllDates()}
						onDateChange={(date) => { this.handleChange(date); }}
						onFocusChange={({ focused }) => { this.handleFocus(focused); }}
					/>
				</div>
			</div>
		);
	}
}

DatePicker.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	placeholder: PropTypes.string,
	defaultSelected: momentPropTypes.momentObj,
	focused: PropTypes.bool,
	numberOfMonths: PropTypes.number,
	allowAllDates: PropTypes.bool,
	extra: PropTypes.any,
	customQuery: PropTypes.func,
	onValueChange: PropTypes.func,
	onQueryChange: PropTypes.func,
	beforeValueChange: PropTypes.func,
	style: PropTypes.object,
	queryFormat: PropTypes.oneOf(Object.keys(helper.dateFormat)),
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	filterLabel: PropTypes.string,
	className: PropTypes.string
};

// Default props value
DatePicker.defaultProps = {
	placeholder: "Select Date",
	numberOfMonths: 1,
	focused: true,
	allowAllDates: true,
	defaultSelected: null,
	style: {},
	queryFormat: "epoch_millis",
	URLParams: false,
	showFilter: true
};

// context type
DatePicker.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired,
	reactiveId: PropTypes.number
};

DatePicker.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.DATE,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	focused: TYPES.BOOLEAN,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	queryFormat: TYPES.STRING,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING
};
