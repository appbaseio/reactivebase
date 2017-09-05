import React, { Component } from "react";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";
import _ from "lodash";

const helper = require("../middleware/helper");

export default class MultiRange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: []
		};
		this.type = "range";
		this.urlParams = helper.URLParams.get(this.props.componentId, true);
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo(this.props);
		this.checkDefault(this.props);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
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
				this.changeValue(null);
			}
		});
	}

	checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId, true);
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (defaultValue) {
				const records = this.props.data.filter(record => defaultValue.indexOf(record.label) > -1);
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records, true), 1000);
				} else {
					// since no records match the selected state should be reset
					setTimeout(this.handleChange.bind(this, null, true), 1000);
				}
			} else {
				this.handleChange(null, true);
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
				component: "MultiRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	customQuery(record) {
		function generateRangeQuery(dataField) {
			if (record.length > 0) {
				return record.map(singleRecord => ({
					range: {
						[dataField]: {
							gte: singleRecord.start,
							lte: singleRecord.end,
							boost: 2.0
						}
					}
				}));
			}
			return null;
		}

		if (record) {
			const query = {
				bool: {
					should: generateRangeQuery(this.props.dataField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return null;
	}

	// handle the input change and pass the value inside sensor info
	// setTrue adds all the matching records to state instead of toggling them
	handleChange(record, setTrue = false) {
		let { selected } = this.state;
		let selectedIndex = null;
		let records = record;

		function setRecord(selectedRecord, index, item) {
			if (item.label === selectedRecord.label) {
				selectedIndex = index;
				selected.splice(index, 1);
			}
		}

		if (record) {
			if (selected === null) {
				selected = [];
			}
			if (!Array.isArray(record)) {
				records = [record];
			}
			if (setTrue) {
				// all matching records should be added to selected state
				selected = [];
				records.forEach((item) => {
					if (this.props.data.some(label => label.label === item.label)) {
						selected.push(item);
					}
				});
			} else {
				records.forEach((item) => {
					selected.forEach((selectedRecord, index) => {
						setRecord(selectedRecord, index, item);
					});
				});

				if (selectedIndex === null) {
					records.forEach((item) => {
						selected.push(item);
					});
				}
			}
		} else {
			selected = null;
		}
		selected = selected === "" ? null : selected;
		selected = selected && selected.length ? selected : null;
		this.defaultSelected = selected;

		this.setState({
			selected
		});

		const obj = {
			key: this.props.componentId,
			value: selected
		};

		const execQuery = () => {
			const isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.URLParams.update(this.props.componentId, this.getSelectedLabels(selected), this.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

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

	getSelectedLabels(selected) {
		return selected ? selected.map(item => item.label) : null;
	}

	renderButtons() {
		let buttons;
		const selectedText = this.state.selected ? this.state.selected.map(record => record.label) : "";
		if (this.props.data) {
			buttons = this.props.data.map((record) => {
				const cx = classNames({
					"rbc-checkbox-active": this.props.showCheckbox,
					"rbc-checkbox-inactive": !this.props.showCheckbox,
					"rbc-list-item-active": selectedText.indexOf(record.label) !== -1,
					"rbc-list-item-inactive": selectedText.indexOf(record.label) === -1
				});

				return (
					<div className={`rbc-list-item row ${cx}`} key={record.label} onClick={() => this.handleChange(record)}>
						<input
							type="checkbox"
							className="rbc-checkbox-item"
							checked={selectedText.indexOf(record.label) > -1}
							value={record.label}
						/>
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

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-checkbox-active": this.props.showCheckbox,
			"rbc-checkbox-inactive": !this.props.showCheckbox
		});

		return (
			<div className={`rbc rbc-multirange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.componentStyle}>
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

MultiRange.propTypes = {
	dataField: React.PropTypes.string.isRequired,
	componentId: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	onQueryChange: React.PropTypes.func,
	showCheckbox: React.PropTypes.bool
};

// Default props value
MultiRange.defaultProps = {
	URLParams: false,
	showFilter: true,
	showCheckbox: true
};

// context type
MultiRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

MultiRange.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	onQueryChange: TYPES.FUNCTION,
	showCheckbox: TYPES.BOOLEAN
};
