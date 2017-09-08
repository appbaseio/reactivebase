import React, { Component } from "react";
import classNames from "classnames";
const helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";
import _ from "lodash";

export default class ToggleButton extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			selected: []
		};
		this.type = "term";
		this.urlParams = helper.URLParams.get(this.props.componentId, true);
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo(this.props);
		setTimeout(() => {
			this.checkDefault(this.props);
		}, 100);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.defaultSelected && !_.isEqual(nextProps.defaultSelected, this.props.defaultSelected)) {
			this.checkDefault(nextProps);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleChange(this.state.selected, true);
		}
	}

	componentWillUnmount() {
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.defaultSelected = null;
				this.handleChange(null);
			}
		});
	}

	checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId, true);
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.valueChange(defaultValue);
	}

	valueChange(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if(this.defaultSelected) {
				this.defaultSelected = Array.isArray(this.defaultSelected) ? this.defaultSelected : [this.defaultSelected];
				const records = this.props.data.filter(record => this.defaultSelected.indexOf(record.label) > -1);
				if (records && records.length) {
					this.handleChange(records, true);
				} else {
					this.handleChange(null);
				}
			} else {
				this.handleChange(null);
			}
		}
	}

	// set the query type and input data
	setQueryInfo(props) {
		const getQuery = (value) => {
			const currentQuery = props.customQuery ? props.customQuery(value) : this.customQuery(value);
			if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
				this.props.onQueryChange(this.previousQuery, currentQuery);
			}
			this.previousQuery = currentQuery;
			return currentQuery;
		};
		const obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.dataField,
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "ToggleButton",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
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
					should: generateTermQuery(this.props.dataField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return query;

		function generateTermQuery(dataField) {
			return record.map((singleRecord, index) => ({
				term: {
					[dataField]: singleRecord.value
				}
			}));
		}
	}

	// handle the input change and pass the value inside sensor info
	handleChange(record, setTrue = false) {
		let { selected } = this.state;
		let newSelection = null;
		let selectedIndex = null;

		if (record) {
			newSelection = [];
			if (setTrue) {
				// All the matching records should be selected and not toggled
				newSelection = record;
			} else {
				selected = selected ? selected : [];
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
			}
			newSelection = newSelection.length ? newSelection : null;
		} else {
			newSelection = null;
		}

		this.setState({
			selected: newSelection
		});

		const obj = {
			key: this.props.componentId,
			value: newSelection
		};

		const execQuery = () => {
			const isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.URLParams.update(this.props.componentId, this.setURLValue(newSelection), this.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value)
			.then(() => {
				execQuery();
			})
			.catch((e) => {
				console.warn(`${this.props.componentId} - beforeValueChange rejected the promise with`, e);
			});
		} else {
			execQuery();
		}
	}

	setURLValue(records) {
		return records ? records.map(item => item.label) : null;
	}

	renderButtons() {
		let buttons;
		const selectedText = this.state.selected ? this.state.selected.map(record => record.label) : "";
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
		}, this.props.className);
		return (
			<div className={`rbc rbc-togglebutton col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.componentStyle}>
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
	dataField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.string
	]),
	multiSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	onQueryChange: React.PropTypes.func,
	filterLabel: React.PropTypes.string,
	className: React.PropTypes.string
};

// Default props value
ToggleButton.defaultProps = {
	multiSelect: true,
	componentStyle: {},
	URLParams: false,
	showFilter: true
};

// context type
ToggleButton.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

ToggleButton.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.KEYWORD,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	multiSelect: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING
};
