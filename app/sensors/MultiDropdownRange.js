import { default as React, Component } from 'react';
import Select from 'react-select';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');

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
		})
		this.handleChange = this.handleChange.bind(this);
		this.defaultQuery = this.defaultQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if(this.props.defaultSelected) {
			let records = this.state.data.filter((record) => {
				return this.props.defaultSelected.indexOf(record.label) > -1 ? true : false;
			});
			if(records && records.length) {
				this.handleChange(records);
			}
		}
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
	defaultQuery(record) {
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

	// use this only if want to create actuators
	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		let depends = this.props.depends ? this.props.depends : {};
		var channelObj = manager.create(this.context.appbaseConfig, depends);
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
			key: this.props.sensorId,
			value: record
		};
		// pass the selected sensor value with sensorId as key,
		let isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// render
	render() {
		let title = null,
			titleExists = false;
		if(this.props.title) {
			titleExists = true;
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		return (
			<div className={`rbc rbc-dropdown col s12 col-xs-12 card thumbnail title-${titleExists}`} style={this.props.defaultStyle}>
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
							searchable={false} />
					</div>
				</div>
			</div>
		);
	}
}

MultiDropdownRange.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	placeholder: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array
};

// Default props value
MultiDropdownRange.defaultProps = {
	placeholder: "Search...",
	size: 10
};

// context type
MultiDropdownRange.contextTypes = {
	appbaseConfig: React.PropTypes.any.isRequired
};
