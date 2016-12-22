import {default as React, Component} from 'react';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');

export class TextField extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			currentValue: ''
		};
		this.type = 'match';
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
		return {
			'term': {
				[this.props.appbaseField]: value
			}
		};
	}

	// use this only if want to create actuators
	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		let depends = this.props.depends ? this.props.depends : {};
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, depends);
	}

	// handle the input change and pass the value inside sensor info
	handleChange(event) {
		let inputVal = event.target.value;
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

	// render
	render() {
		let title = null,
			titleExists = false,
			textFieldClass = 'rbc rbc-textfield col s12 col-xs-12 card thumbnail';
		if(this.props.title) {
			titleExists = true;
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		textFieldClass += ' title-' + titleExists;
		return (
			<div className={textFieldClass}>
				{title}
				<div className="rbc-search-component col s12 col-xs-12">
					<input className="rbc-input" type="text" onChange={this.handleChange} placeholder={this.props.placeholder} value={this.state.currentValue} />
				</div>
			</div>
		);
	}
}

TextField.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.string,
	placeholder: React.PropTypes.string
};

// Default props value
TextField.defaultProps = {
};

// context type
TextField.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
