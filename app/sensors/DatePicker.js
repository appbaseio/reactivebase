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
		this.defaultQuery = this.defaultQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
	}

	// set the query type and input data
	setQueryInfo() {
		let obj = {
			key: this.props.sensorId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				defaultQuery: this.defaultQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	defaultQuery(value) {
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
	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		let depends = this.props.depends ? this.props.depends : {};
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, depends);
	}

	// handle the input change and pass the value inside sensor info
	handleChange(inputVal) {
		this.setState({
			'currentValue': inputVal
		});
		var obj = {
			key: this.props.sensorId,
			value: inputVal
		};
		// pass the selected sensor value with sensorId as key,
		let isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// handle focus
	handleFocus(focus) {
		this.setState({
			focused: focus
		});
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
			<div className={`rbc rbc-DatePicker col s12 col-xs-12 card thumbnail ${cx}`}>
				{title}
				<div className="rb-datepicker-component col s12 col-xs-12">
					<SingleDatePicker
						id={this.props.sensorId}
						date={this.state.currentValue}
						placeholder={this.props.placeholder}
						focused={this.state.focused}
						numberOfMonths={this.props.numberOfMonths}
						isOutsideRange={() => false}
						{...this.props.extra}
						onDateChange={(date) => { this.handleChange(date) }}
						onFocusChange={({ focused }) => { this.handleFocus(focused) }}
					/>
				</div>
			</div>
		);
	}
}

DatePicker.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	date: momentPropTypes.momentObj,
	focused: React.PropTypes.bool,
	numberOfMonths: React.PropTypes.number,
	extra: React.PropTypes.any
};

// Default props value
DatePicker.defaultProps = {
	placeholder: 'Select Date',
	numberOfMonths: 1,
	focused: true,
	date: null
};

// context type
DatePicker.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
