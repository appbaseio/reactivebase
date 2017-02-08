import { default as React, Component } from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');
var _ = require('lodash');

export class MultiDropdownRange extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			selected: ""
		};
		this.type = 'range';
		this.state.data = this.props.data.map(item => {
			item.value = item.label;
			return item;
		});
		this.defaultSelected = this.props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if(this.defaultSelected) {
			let records = this.state.data.filter((record) => {
				return this.defaultSelected.indexOf(record.label) > -1 ? true : false;
			});
			if(records && records.length) {
				this.handleChange(records);
			}
		}
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (!_.isEqual(this.defaultSelected, this.props.defaultSelected)) {
				this.defaultSelected = this.props.defaultSelected;
				let records = this.state.data.filter((record) => {
					return this.defaultSelected.indexOf(record.label) > -1 ? true : false;
				});
				if(records && records.length) {
					this.handleChange(records);
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
				customQuery: this.customQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	customQuery(record) {
		if(record) {
			let query = {
				bool: {
					should: generateRangeQuery(this.props.appbaseField),
					"minimum_should_match" : 1,
					"boost" : 1.0
				}
			};
			return query;
		}
		function generateRangeQuery(appbaseField) {
			if (record.length > 0) {
				return record.map((singleRecord, index) => {
					return {
						range: {
								[appbaseField]: {
								gte: singleRecord.start,
								lte: singleRecord.end,
								boost: 2.0
							}
						}
					};
				});
			}
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
		let selected = [];
		selected = record.map(item => item.label);
		selected = selected.join();
		this.setState({
			'selected': selected
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
			<div className={`rbc rbc-multidropdownrange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.defaultStyle}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12">
						<Select
							options={this.state.data}
							value={this.state.selected}
							onChange={this.handleChange}
							clearable={false}
							multi={true}
							placeholder={this.props.placeholder}
							searchable={true} />
					</div>
				</div>
			</div>
		);
	}
}

MultiDropdownRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array
};

// Default props value
MultiDropdownRange.defaultProps = {
};

// context type
MultiDropdownRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
