import {default as React, Component} from 'react';
import { SingleDatePicker } from 'react-dates';
import classNames from 'classnames';
var moment = require('moment');
var momentPropTypes = require('react-moment-proptypes');
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');

export class DatePicker extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			currentValue: this.props.date,
			focused: this.props.focused
		};
		this.type = 'range';
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
		if (this.props.date && this.defaultDate != this.props.date) {
			this.defaultDate = this.props.date;
			this.handleChange(this.defaultDate);
		}
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
						gte: value,
						lt: moment(value).add(1, 'days')
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
	handleFocus(focus) {
		this.setState({
			focused: focus
		});
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
			<div className={`rbc rbc-datepicker col s12 col-xs-12 card thumbnail ${cx}`}>
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
						onDateChange={(date) => { this.handleChange(date) }}
						onFocusChange={({ focused }) => { this.handleFocus(focused) }}
					/>
				</div>
			</div>
		);
	}
}

DatePicker.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	date: momentPropTypes.momentObj,
	focused: React.PropTypes.bool,
	numberOfMonths: React.PropTypes.number,
	allowAllDates: React.PropTypes.bool,
	extra: React.PropTypes.any
};

// Default props value
DatePicker.defaultProps = {
	placeholder: 'Select Date',
	numberOfMonths: 1,
	focused: true,
	allowAllDates: true,
	date: null
};

// context type
DatePicker.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
