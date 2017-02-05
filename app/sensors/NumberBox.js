import React, {Component} from 'react';
import classNames from 'classnames';

import {manager} from '../middleware/ChannelManager.js';
const helper = require('../middleware/helper.js');

const COMPONENT_QUERY_TYPE = 'term';

const TitleComponent = (props) => (
	<h4 className="rbc-title col s12 col-xs-12">{props.title}</h4>
);

const NumberBoxButtonComponent = (props) => {
	const componentState = props.isActive
		? 'active'
		: 'inactive';
	const {type} = props;
	const increment = type == 'plus'
		? 1
		: -1;
	return (
		<button className={`btn rbc-btn rbc-numberbox-btn rbc-numberbox-btn-${componentState}`} onClick={() => props.handleChange(increment)}>
			<span className={`fa fa-${type} rbc-numberbox-btn-icon`}></span>
		</button>
	);
};

const NumberComponent = (props) => {
	const {label, max, min, labelPosition, handleChange} = props;
	const value = props.value
		? props.value
		: this.state.currentValue;
	const isPlusActive = max
		? value < max
		: true;
	const isMinusActive = min
		? value > min
		: true;
	const position = labelPosition
		? labelPosition
		: 'left';
	return (
		<div className={`rbc rbc-numberbox-container bc-numberbox-container-${position} col s12 col-xs-12`}>
			<div className={`rbc-label rbc-numberbox-label`}>{label}</div>
			<div className={"rbc-numberbox-btn-container"}>
				<NumberBoxButtonComponent isActive={isMinusActive} handleChange={handleChange} type={'minus'}/>
				<span className={"rbc-numberbox-number"}>{value}</span>
				<NumberBoxButtonComponent isActive={isPlusActive} handleChange={handleChange} type={'plus'}/>
			</div>
		</div>
	);
};

class NumberBox extends Component {
	constructor(props, context) {
		super(props);
		const {defaultSelected, focused} = this.props;
		this.state = {
			currentValue: defaultSelected,
			focused: focused
		}
		this.type = COMPONENT_QUERY_TYPE;
		this.handleChange = this.handleChange.bind(this);
		this.defaultQuery = this.defaultQuery.bind(this);
	}

	componentDidMount() {
		this.setQueryInfo();
	}

	// build query for this sensor only
	defaultQuery(value) {
		return {
			'term': {
				[this.props.appbaseField]: value
			}
		};
	}

	setQueryInfo() {
		const {sensorId, appbaseField} = this.props;
		const obj = {
			key: sensorId,
			value: {
				queryType: COMPONENT_QUERY_TYPE,
				inputData: appbaseField,
				defaultQuery: this.defaultQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// use this only if want to create actuators
	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		const depends = this.props.depends
			? this.props.depends
			: {};
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, depends);
	}

	// handle the input change and pass the value inside sensor info
	handleChange(increment) {
		const {sensorId, data} = this.props;
		const {min, max} = data;
		const {currentValue} = this.state;
		let inputVal = currentValue;
		if (increment > 0) {
			if ((max && currentValue < max) || (!max)) {
				inputVal += 1;
			}
		} else {
			if ((min && currentValue > min) || (!min)) {
				inputVal -= 1;
			}
		}
		this.setState({'currentValue': inputVal});
		const obj = {
			key: sensorId,
			value: inputVal
		};
		// pass the selected sensor value with sensorId as key,
		const isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	render() {
		const {title, data, labelPosition, defaultStyle} = this.props;
		const {currentValue} = this.state;
		const ComponentTitle = title
			? <TitleComponent title={title}/>
			: null;
		const cx = classNames({
			'rbc-title-active': title,
			'rbc-title-inactive': !title
		});
		return (
			<div className={`rbc rbc-numberbox col s12 col-xs-12 card thumbnail ${cx}`} style={defaultStyle}>
				<div className="row">
					{ComponentTitle}
					<NumberComponent handleChange={this.handleChange} value={currentValue} label={data.label} min={data.min} max={data.max} labelPosition={labelPosition}/>
				</div>
			</div>
		);
	}
};

NumberBox.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array,
	labelPosition: React.PropTypes.string
};

// context type
NumberBox.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

export {NumberBox};
