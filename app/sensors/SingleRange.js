import {default as React, Component} from 'react';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');
import * as TYPES from '../middleware/constants.js';

export class SingleRange extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			selected: null
		};
		this.type = 'range';
		this.defaultSelected = this.props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
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
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery:  this.props.customQuery ? this.props.customQuery : this.customQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	customQuery(record) {
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
	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		let react = this.props.react ? this.props.react : {};
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
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

	renderButtons() {
		let buttons;
		let selectedText = this.state.selected && this.state.selected.label ? this.state.selected.label : '';
		if(this.props.data) {
			buttons = this.props.data.map((record, i) => {
				return (
					<div className="rbc-list-item row" key={i} onClick={() => this.handleChange(record)}>
						<input type="radio"
							className="rbc-radio-item"
							checked={selectedText === record.label}
							value={record.label} />
						<label className="rbc-label">{record.label}</label>
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
			<div className={`rbc rbc-singlerange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.defaultStyle}>
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
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.string
};

// Default props value
SingleRange.defaultProps = {
	title: null
};

// context type
SingleRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

SingleRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY
};
