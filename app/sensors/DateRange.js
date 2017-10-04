import React, { Component } from "react";
import PropTypes from "prop-types";
import { DateRangePicker } from "react-dates";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";
import moment from "moment";
import momentPropTypes from "react-moment-proptypes";

const helper = require("../middleware/helper");

export default class DateRange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentValue: {
				startDate: this.props.defaultSelected.start,
				endDate: this.props.defaultSelected.end
			},
			focusedInput: null
		};
		this.type = "range";
		this.urlParams = props.URLParams ? this.getURLParams() : null;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo(this.props);
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
	}

	componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if (data === this.props.componentId) {
				this.startDate = null;
				this.endDate = null;
				const dateSelectionObj = null;
				this.handleChange(dateSelectionObj);
			}
		});
	}

	getURLParams() {
		let urlParams = helper.URLParams.get(this.props.componentId, false, true);
		if (urlParams !== null) {
			urlParams = {
				start: moment(urlParams.start),
				end: moment(urlParams.end)
			};
		}
		return urlParams;
	}

	// handle focus
	onFocusChange(focusedInput) {
		this.setState({ focusedInput });
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
				component: "DateRange"
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	isDateChange() {
		let flag = false;

		const checkDefault = (defaultSelected) => {
			let flag1 = false;
			if (defaultSelected.start && defaultSelected.end) {
				this.startDate = defaultSelected.start;
				this.endDate = defaultSelected.end;
				flag1 = true;
			}
			return flag1;
		};

		const isChanged = (defaultSelected) => {
			if (moment(this.startDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(defaultSelected.start).format(helper.dateFormat[this.props.queryFormat]) && moment(this.endDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(defaultSelected.end).format(helper.dateFormat[this.props.queryFormat])) {
				this.startDate = defaultSelected.start;
				this.endDate = defaultSelected.end;
				flag = true;
			}
			return flag;
		};
		const defaultSelected = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		try {
			if (this.startDate && this.endDate) {
				flag = isChanged(defaultSelected);
			} else {
				flag = checkDefault.call(this, defaultSelected);
			}
		} catch (e) {
			flag = checkDefault.call(this, defaultSelected);
		}
		return flag;
	}

	checkDefault() {
		if (this.isDateChange()) {
			const dateSelectionObj = {
				startDate: this.startDate,
				endDate: this.endDate
			};
			setTimeout(this.handleChange.bind(this, dateSelectionObj), 1000);
		}
	}

	// build query for this sensor only
	customQuery(value) {
		let query = null;
		if (value && value.startDate && value.endDate) {
			query = this.generateQuery(value);
		}
		return query;
	}

	generateQuery(value) {
		let query;
		if (Array.isArray(this.props.dataField) && this.props.dataField.length === 2) {
			query = {
				bool: {
					must: [{
						range: {
							[this.props.dataField[0]]: {
								lte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat])
							}
						}
					}, {
						range: {
							[this.props.dataField[1]]: {
								gte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
							}
						}
					}]
				}
			};
		} else if (Array.isArray(this.props.dataField)) {
			query = {
				range: {
					[this.props.dataField[0]]: {
						gte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat]),
						lte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
					}
				}
			};
		} else {
			query = {
				range: {
					[this.props.dataField]: {
						gte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat]),
						lte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
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
		// if (inputVal.startDate && inputVal.endDate) {
		// 	this.setValue(inputVal);
		// }
		this.setValue(inputVal);
	}

	setValue(inputVal) {
		const obj = {
			key: this.props.componentId,
			value: inputVal
		};

		const nextValue = {
			start: inputVal.startDate,
			end: inputVal.endDate
		};

		const execQuery = () => {
			const isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(nextValue);
			}
			if (this.props.URLParams) {
				helper.URLParams.update(this.props.componentId, this.urlFriendlyValue(inputVal), this.props.URLParams);
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

	urlFriendlyValue(value) {
		if (value && value.startDate && value.endDate) {
			value = {
				start: value.startDate,
				end: value.endDate
			};
			value = JSON.stringify(value);
		} else {
			value = null;
		}
		return value;
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
			<div className={`rbc rbc-daterange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
				{title}
				<div className="rbc-daterange-component col s12 col-xs-12">
					<DateRangePicker
						startDate={this.state.currentValue ? this.state.currentValue.startDate : null}
						endDate={this.state.currentValue ? this.state.currentValue.endDate : null}
						focusedInput={this.state.focusedInput}
						numberOfMonths={this.props.numberOfMonths}
						{...this.props.extra}
						{...this.allowAllDates()}
						onDatesChange={(date) => { this.handleChange(date); }}
						onFocusChange={this.onFocusChange}
					/>
				</div>
			</div>
		);
	}
}

DateRange.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array
	]),
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	defaultSelected: PropTypes.shape({
		start: momentPropTypes.momentObj,
		end: momentPropTypes.momentObj
	}),
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
DateRange.defaultProps = {
	numberOfMonths: 2,
	allowAllDates: true,
	defaultSelected: {
		start: null,
		end: null
	},
	queryFormat: "epoch_millis",
	URLParams: false,
	showFilter: true
};

// context type
DateRange.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired,
	reactiveId: PropTypes.number
};

DateRange.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.ARRAY,
	dataFieldType: TYPES.DATE,
	title: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	queryFormat: TYPES.STRING,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING
};
