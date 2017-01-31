import { default as React, Component } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');

export class SingleDropdownRange extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			selected: null
		};
		this.type = 'range';
		this.defaultSelected = this.props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.defaultQuery = this.defaultQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if(this.defaultSelected) {
			let records = this.props.data.filter((record) => {
				return record.label === this.defaultSelected;
			});
			if(records && records.length) {
				this.handleChange(records[0]);
			}
		}
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.defaultSelected != this.props.defaultSelected) {
				this.defaultSelected = this.props.defaultSelected;
				let records = this.props.data.filter((record) => {
					return record.label === this.defaultSelected;
				});
				if(records && records.length) {
					this.handleChange(records[0]);
				}
			}
		}, 300);
	}

	// set the query type and input data
	setQueryInfo() {
		let obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				defaultQuery: this.defaultQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	defaultQuery(record) {
		if(record) {
			return {
				range: {
						[this.props.appbaseField]: {
						gte: record.start,
						lte: record.end,
						boost: 2.0
					}
				}
			};
		}
	}

	// use this only if want to create actuators
	// Create a channel which passes the actuate and receive results whenever actuate changes
	createChannel() {
		let actuate = this.props.actuate ? this.props.actuate : {};
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, actuate);
	}

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		this.setState({
			'selected': record
		});
		var obj = {
			key: this.props.componentId,
			value: record
		};
		// pass the selected sensor value with componentId as key,
		let isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// render
	render() {
		let title = null;
		if(this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		let cx = classNames({
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title,
			'rbc-placeholder-active': this.props.placeholder,
			'rbc-placeholder-inactive': !this.props.placeholder
		});

		return (
			<div className={`rbc rbc-singledropdownrange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.defaultStyle}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12">
						<Select
							options={this.props.data}
							clearable={false}
							value={this.state.selected}
							onChange={this.handleChange}
							placeholder={this.props.placeholder}
							searchable={true} />
					</div>
				</div>
			</div>
		);
	}
}

SingleDropdownRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.string
};

// Default props value
SingleDropdownRange.defaultProps = {
	placeholder: "Search",
};

// context type
SingleDropdownRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
