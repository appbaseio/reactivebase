import React, { Component } from "react";
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
		this.urlParams = helper.URLParams.get(this.props.componentId);
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if(this.urlParams !== null) {
			this.handleChange(moment(this.urlParams), true);
		}
		this.checkDefault();
		this.listenFilter();
	}

	componentWillReceiveProps() {
		this.checkDefault();
	}

	componentWillUnmount() {
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.defaultDate = null;
				this.handleChange(this.defaultDate);
			}
		});
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

	checkDefault() {
		if(this.urlParams !== null && this.props.queryFormat && helper.dateFormat[this.props.queryFormat] && moment(this.defaultDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(this.urlParams).format(helper.dateFormat[this.props.queryFormat])) {
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
					[this.props.appbaseField]: {
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
		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		if (this.props.onValueChange) {
			this.props.onValueChange(obj.value);
		}
		helper.URLParams.update(this.props.componentId, inputVal, this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
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
		});
		return (
			<div className={`rbc rbc-datepicker col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.componentStyle}>
				{title}
				<div className="col s12 col-xs-12">
					<SingleDatePicker
						id={this.props.componentId}
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
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	placeholder: React.PropTypes.string,
	defaultSelected: momentPropTypes.momentObj,
	focused: React.PropTypes.bool,
	numberOfMonths: React.PropTypes.number,
	allowAllDates: React.PropTypes.bool,
	extra: React.PropTypes.any,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	queryFormat: React.PropTypes.oneOf(Object.keys(helper.dateFormat)),
	URLParams: React.PropTypes.bool,
	allowFilter: React.PropTypes.bool
};

// Default props value
DatePicker.defaultProps = {
	placeholder: "Select Date",
	numberOfMonths: 1,
	focused: true,
	allowAllDates: true,
	defaultSelected: null,
	componentStyle: {},
	queryFormat: "epoch_millis",
	URLParams: false,
	allowFilter: true
};

// context type
DatePicker.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

DatePicker.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.DATE,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	focused: TYPES.BOOLEAN,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	queryFormat: TYPES.STRING,
	URLParams: TYPES.BOOLEAN,
	allowFilter: TYPES.BOOLEAN
};
