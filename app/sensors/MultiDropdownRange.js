import React, { Component } from "react";
import Select from "react-select";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";
import _ from "lodash";

const helper = require("../middleware/helper");

export default class MultiDropdownRange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: ""
		};
		this.type = "range";
		this.state.data = props.data.map((item) => {
			item.value = item.label;
			return item;
		});
		this.urlParams = helper.URLParams.get(props.componentId, true);
		this.defaultSelected = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo(this.props);
		if (this.defaultSelected) {
			const records = this.state.data.filter(record => this.defaultSelected.indexOf(record.label) > -1);
			if (records && records.length) {
				setTimeout(this.handleChange.bind(this, records), 1000);
			}
		}
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.urlParams = helper.URLParams.get(nextProps.componentId, true);
			const defaultValue = this.urlParams !== null ? this.urlParams : nextProps.defaultSelected;
			this.valueChange(defaultValue);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.valueChange(this.state.selected, true);
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

	valueChange(defaultValue, execute) {
		if (!_.isEqual(this.defaultSelected, defaultValue) || execute) {
			this.defaultSelected = defaultValue;
			const records = this.state.data.filter(record => this.defaultSelected.indexOf(record.label) > -1);
			if (records && records.length) {
				if(this.urlParams !== null) {
					this.handleChange(records);
				} else {
					setTimeout(this.handleChange.bind(this, records), 1000);
				}
			} else {
				setTimeout(this.handleChange.bind(this, null), 1000);
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
				component: "MultiDropdownRange",
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
	handleChange(record) {
		let selected = record ? [] : null;
		if(record) {
			selected = record.map(item => item.label);
			selected = selected.join();
		}
		selected = selected === "" ? null : selected;
		record = record === "" ? null : record;
		record = record && record.length ? record : null;
		this.setState({
			selected
		});
		const obj = {
			key: this.props.componentId,
			value: record
		};

		const execQuery = () => {
			const isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.URLParams.update(this.props.componentId, selected, this.props.URLParams);
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

	// render
	render() {
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder
		}, this.props.className);

		return (
			<div className={`rbc rbc-multidropdownrange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12">
						<Select
							options={this.state.data}
							value={this.state.selected}
							onChange={this.handleChange}
							clearable={false}
							multi
							placeholder={this.props.placeholder}
							searchable
						/>
					</div>
				</div>
			</div>
		);
	}
}

MultiDropdownRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.string.isRequired,
	data: React.PropTypes.any.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	placeholder: React.PropTypes.string,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	onQueryChange: React.PropTypes.func,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	style: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	className: React.PropTypes.string
};

// Default props value
MultiDropdownRange.defaultProps = {
	URLParams: false,
	showFilter: true
};

// context type
MultiDropdownRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

MultiDropdownRange.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	data: TYPES.OBJECT,
	dataFieldType: TYPES.NUMBER,
	defaultSelected: TYPES.ARRAY,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING
};
