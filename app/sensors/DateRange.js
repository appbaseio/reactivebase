import {default as React, Component} from 'react';
import { DateRangePicker } from 'react-dates';
import classNames from 'classnames';
var moment = require('moment');
var momentPropTypes = require('react-moment-proptypes');
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');
import * as TYPES from '../middleware/constants.js';

export class DateRange extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			currentValue: {
				startDate: this.props.defaultSelected.start,
				endDate: this.props.defaultSelected.end
			},
			focusedInput: null
		};
		this.type = 'range';
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
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
		if (this.isDateChange()) {
			let dateSelectionObj = {
				startDate: this.startDate,
				endDate: this.endDate
			};
			setTimeout(this.handleChange.bind(this, dateSelectionObj), 1000);
		}
	}

	isDateChange() {
		let flag = false;
		try {
			if(this.startDate && this.endDate) {
				if(moment(this.startDate).format('YYYY-MM-DD') != moment(this.props.defaultSelected.start).format('YYYY-MM-DD') && moment(this.endDate).format('YYYY-MM-DD') != moment(this.props.defaultSelected.end).format('YYYY-MM-DD')) {
					this.startDate = this.props.defaultSelected.start;
					this.endDate = this.props.defaultSelected.end;
					flag = true;
				}
			} else {
				flag = checkDefault.call(this);
			}
		} catch(e) {
			flag = checkDefault.call(this);
		}

		function checkDefault() {
			let flag1 = false;
			if(this.props.defaultSelected.start && this.props.defaultSelected.end) {
				this.startDate = this.props.defaultSelected.start;
				this.endDate = this.props.defaultSelected.end;
				flag1 = true;
			}
			return flag1;
		}
		return flag;
	}

	// set the query type and input data
	setQueryInfo() {
		let obj = {
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
		let query = null;
		if(value) {
			query = {
				'range': {
					[this.props.appbaseField]: {
						gte: value.startDate,
						lte: value.endDate
					}
				}
			};
		}
		return query;
	}

	// use this only if want to create actuators
	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		let react = this.props.react ? this.props.react : {};
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
	}

	// handle the input change and pass the value inside sensor info
	handleChange(inputVal) {
		this.setState({
			'currentValue': inputVal
		});
		var obj = {
			key: this.props.componentId,
			value: inputVal
		};
		// pass the selected sensor value with componentId as key,
		let isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// handle focus
	onFocusChange(focusedInput) {
		this.setState({ focusedInput });
	}

	// allow all dates
	allowAllDates() {
		let outsideObj;
		if(this.props.allowAllDates) {
			outsideObj = {
				isOutsideRange: isOutsideRange
			};
		}
		function isOutsideRange() {
			return false;
		}
		// isOutsideRange={() => false}
		return outsideObj;
	}

	// render
	render() {
		let title = null;
		if(this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		let cx = classNames({
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title
		});
		return (
			<div className={`rbc rbc-daterange col s12 col-xs-12 card thumbnail ${cx}`}>
				{title}
				<div className="rbc-daterange-component col s12 col-xs-12">
					<DateRangePicker
						id={this.props.componentId}
						startDate={this.state.currentValue.startDate}
						endDate={this.state.currentValue.endDate}
						focusedInput={this.state.focusedInput}
						numberOfMonths={this.props.numberOfMonths}
						{...this.props.extra}
						{...this.allowAllDates()}
						onDatesChange={(date) => { this.handleChange(date) }}
						onFocusChange={this.onFocusChange}
					/>
				</div>
			</div>
		);
	}
}

DateRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	defaultSelected: React.PropTypes.shape({
		startDate: momentPropTypes.momentObj,
		endDate: momentPropTypes.momentObj,
	}),
	numberOfMonths: React.PropTypes.number,
	allowAllDates: React.PropTypes.bool,
	extra: React.PropTypes.any,
	customQuery: React.PropTypes.func
};

// Default props value
DateRange.defaultProps = {
	placeholder: 'Select Date',
	numberOfMonths: 2,
	allowAllDates: true,
	defaultSelected: {
		start: null,
		end: null
	}
};

// context type
DateRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

DateRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION
};
