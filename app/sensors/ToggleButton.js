import React, { Component } from "react";
import classNames from "classnames";
const helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";

export default class ToggleButton extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			selected: []
		};
		this.type = "term";
		this.defaultSelected = this.props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentDidMount() {
		this.setQueryInfo();
		if (this.defaultSelected) {
			const records = this.props.data.filter(record => this.defaultSelected.indexOf(record.label) > -1);
			if (records && records.length) {
				records.forEach((singleRecord) => {
					setTimeout(this.handleChange.bind(this, singleRecord), 1000);
				});
			}
		}
	}

	componentWillUpdate() {
		if (this.defaultSelected != this.props.defaultSelected) {
			this.defaultSelected = this.props.defaultSelected;
			const records = this.props.data.filter(record => this.defaultSelected.indexOf(record.label) > -1);
			if (records && records.length) {
				records.forEach((singleRecord) => {
					setTimeout(this.handleChange.bind(this, singleRecord), 1000);
				});
			}
		}
	}

	// set the query type and input data
	setQueryInfo() {
		const obj = {
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
		let query = null;
		if (record && record.length) {
			query = {
				bool: {
					should: generateRangeQuery(this.props.appbaseField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return query;


		function generateRangeQuery(appbaseField) {
			return record.map((singleRecord, index) => ({
				term: {
					[appbaseField]: singleRecord.value
				}
			}));
		}
	}

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		const selected = this.state.selected;
		let newSelection = [];
		let selectedIndex = null;
		selected.forEach((selectedRecord, index) => {
			if (record.label === selectedRecord.label) {
				selectedIndex = index;
				selected.splice(index, 1);
			}
		});
		if (selectedIndex === null) {
			if (this.props.multiSelect) {
				selected.push(record);
				newSelection = selected;
			} else {
				newSelection.push(record);
			}
		} else {
			newSelection = selected;
		}
		this.setState({
			selected: newSelection
		});
		const obj = {
			key: this.props.componentId,
			value: newSelection
		};
		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	renderButtons() {
		let buttons;
		const selectedText = this.state.selected.map(record => record.label);
		if (this.props.data) {
			buttons = this.props.data.map((record, i) => (
				<button
					key={i} className={`btn rbc-btn ${selectedText.indexOf(record.label) > -1 ? "rbc-btn-active" : "rbc-btn-inactive"}`}
					onClick={() => this.handleChange(record)} title={record.title ? record.title : record.label}
				>
					{record.label}
				</button>
				));
		}
		return buttons;
	}

	// render
	render() {
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-multiselect-active": this.props.multiSelect,
			"rbc-multiselect-inactive": !this.props.multiSelect
		});
		return (
			<div className={`rbc rbc-togglebutton col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.defaultStyle}>
				<div className="row">
					{title}
					<div className="rbc-buttongroup col s12 col-xs-12">
						{this.renderButtons()}
					</div>
				</div>
			</div>
		);
	}
}

ToggleButton.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array,
	multiSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func
};

// Default props value
ToggleButton.defaultProps = {
	multiSelect: true
};

// context type
ToggleButton.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

ToggleButton.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	multiSelect: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION
};
