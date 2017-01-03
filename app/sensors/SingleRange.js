import {default as React, Component} from 'react';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');

export class SingleRange extends Component {
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
			if(this.defaultSelected != this.props.defaultSelected) {
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
	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		let depends = this.props.depends ? this.props.depends : {};
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, depends);

	}

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		this.setState({
			'selected': record
		});
		var obj = {
			key: this.props.sensorId,
			value: record
		};
		// pass the selected sensor value with sensorId as key,
		let isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	renderButtons() {
		let buttons;
		let selectedText = this.state.selected && this.state.selected.label ? this.state.selected.label : '';
		if(this.props.data) {
			buttons = this.props.data.map((record, i) => {
				return (
					<div className="rbc-list-item row" key={i} onClick={() => this.handleChange(record)}>
						<div className="col s12 col-xs-12">
							<input type="radio"
								checked={selectedText === record.label}
								name="SingleRange" id="SingleRange"
								value={record.label} />
							<label > {record.label} </label>
						</div>
					</div>
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
			<div className={`rbc rbc-range col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.defaultStyle}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12 rbc-list-container">
						{this.renderButtons()}
					</div>
				</div>
			</div>
		);
	}
}

SingleRange.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	placeholder: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.string
};

// Default props value
SingleRange.defaultProps = {
	placeholder: "Search...",
	size: 10
};

// context type
SingleRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
