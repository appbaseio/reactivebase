import {default as React, Component} from 'react';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');

export class ToggleButton extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			selected: []
		};
		this.type = 'term';
		this.defaultSelected = this.props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.defaultQuery = this.defaultQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if(this.defaultSelected) {
			let records = this.props.data.filter((record) => {
				return this.defaultSelected.indexOf(record.label) > -1 ? true : false;
			});
			if(records && records.length) {
				records.forEach((singleRecord) => {
					this.handleChange(singleRecord);
				});
			}
		}
	}

	componentWillUpdate() {
		if(this.defaultSelected != this.props.defaultSelected) {
			this.defaultSelected = this.props.defaultSelected;
			let records = this.props.data.filter((record) => {
				return this.defaultSelected.indexOf(record.label) > -1 ? true : false;
			});
			if(records && records.length) {
				records.forEach((singleRecord) => {
					this.handleChange(singleRecord);
				});
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
			console.log(query);
			return query;
		}
		function generateRangeQuery(appbaseField) {
			return record.map((singleRecord, index) => {
				return {
					term: {
						[appbaseField]: singleRecord.value
					}
				};
			});
		}
	}

	// use this only if want to create actuators
	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		let depends = this.props.depends ? this.props.depends : {};
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, depends);
	}

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		let selected = this.state.selected;
		let selectedIndex = null;
		let isAlreadySelected = selected.forEach((selectedRecord, index) => {
			if(record.label === selectedRecord.label) {
				selectedIndex = index;
				selected.splice(index, 1);
			}
		});
		if(selectedIndex === null) {
			selected.push(record);
		}
		this.setState({
			'selected': selected
		});
		var obj = {
			key: this.props.sensorId,
			value: selected
		};
		// pass the selected sensor value with sensorId as key,
		let isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	renderButtons() {
		let buttons;
		let selectedText = this.state.selected.map((record) => {
			return record.label;
		});
		if(this.props.data) {
			buttons = this.props.data.map((record, i) => {
				return (
					<button key={i} className={"btn "+ (selectedText.indexOf(record.label) > -1 ? 'rbc-btn-active' : 'rbc-btn-inactive')}
						onClick={() => this.handleChange(record)} title={record.title ? record.title: record.label}>
						{record.label}
					</button>
				);
			});
		}
		return buttons;
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
			<div className={`rbc rbc-togglebutton col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.defaultStyle}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12">
						{this.renderButtons()}
					</div>
				</div>
			</div>
		);
	}
}

ToggleButton.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array
};

// Default props value
ToggleButton.defaultProps = {
};

// context type
ToggleButton.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
