import {default as React, Component} from 'react';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');
var _ = require('lodash');

export class MultiRange extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			selected: []
		};
		this.type = 'range';
		this.defaultSelected = this.props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.resetState = this.resetState.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if(this.props.defaultSelected) {
			let records = this.props.data.filter((record) => {
				return this.props.defaultSelected.indexOf(record.label) > -1 ? true : false;
			});
			if(records && records.length) {
				records.forEach((singleRecord) => {
					this.handleChange(singleRecord);
				});
			}
		}
	}

	componentWillUpdate() {
		setTimeout(() => {
			if(!_.isEqual(this.defaultSelected, this.props.defaultSelected)) {
				this.defaultSelected = this.props.defaultSelected;
				this.resetState();
				let records = this.props.data.filter((record) => {
					return this.props.defaultSelected.indexOf(record.label) > -1 ? true : false;
				});
				if(records && records.length) {
					records.forEach((singleRecord) => {
						this.handleChange(singleRecord);
					});
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
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
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
	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		let react = this.props.react ? this.props.react : {};
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
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
			key: this.props.componentId,
			value: selected
		};
		// pass the selected sensor value with componentId as key,
		let isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	resetState() {
		this.setState({
			selected: []
		});
		var obj = {
			key: this.props.componentId,
			value: []
		};
		// pass the selected sensor value with componentId as key,
		let isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	handleTagClick(label) {
		let target = this.state.selected.filter(record => record.label == label);
		this.handleChange(target[0]);
	}

	renderButtons() {
		let buttons;
		let selectedText = this.state.selected.map((record) => {
			return record.label;
		});
		if(this.props.data) {
			buttons = this.props.data.map((record, i) => {
				return (
					<div className="rbc-list-item row" key={i} onClick={() => this.handleChange(record)}>
						<input type="checkbox"
							className="rbc-checkbox-item"
							checked={selectedText.indexOf(record.label) > -1 ? true : false}
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
		let title = null,
			TagItemsArray = [];

		if(this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		if(this.props.showTags && this.state.selected) {
			this.state.selected.forEach(function (item) {
				TagItemsArray.push(<Tag
					key={item.label}
					value={item.label}
					onClick={this.handleTagClick} />);
			}.bind(this));
		}

		let cx = classNames({
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title
		});

		return (
			<div className={`rbc rbc-multirange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.defaultStyle}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12 rbc-list-container">
						{
							TagItemsArray.length ?
							<div className="row" style={{'marginTop': '0'}}>
								{TagItemsArray}
							</div> :
							null
						}
						{this.renderButtons()}
					</div>
				</div>
			</div>
		);
	}
}

class Tag extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span onClick={this.props.onClick.bind(null, this.props.value) } className="rbc-tag-item col">
				<a href="javascript:void(0)" className="close">×</a>
				<span>{this.props.value}</span>
			</span>
		);
	}
}

MultiRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array,
	showTags: React.PropTypes.bool
};

// Default props value
MultiRange.defaultProps = {
	showTags: true
};

// context type
MultiRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
