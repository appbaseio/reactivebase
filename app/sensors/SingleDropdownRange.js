import React, { Component } from "react";
import classNames from "classnames";
import Select from "react-select";
import * as TYPES from "../middleware/constants";
import _ from "lodash";

const helper = require("../middleware/helper");

export default class SingleDropdownRange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: null
		};
		this.type = "range";
		this.urlParams = helper.URLParams.get(this.props.componentId);
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
			this.changeValue(nextProps.defaultSelected);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleChange(this.state.selected);
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
		this.urlParams = helper.URLParams.get(props.componentId);
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if(this.defaultSelected) {
				const records = this.props.data.filter(record => record.label === this.defaultSelected);
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records[0]), 1000);
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
				component: "SingleDropdownRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	customQuery(record) {
		if (record) {
			return {
				range: {
					[this.props.dataField]: {
						gte: record.start,
						lte: record.end,
						boost: 2.0
					}
				}
			};
		}
	}

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		this.setState({
			selected: record
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
			this.defaultSelected = record;
			helper.URLParams.update(this.props.componentId, record ? record.label : null, this.props.URLParams);
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

		const data = this.props.data.map((item) => {
			item.value = item.label;
			return item;
		});

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder
		});

		return (
			<div className={`rbc rbc-singledropdownrange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12">
						<Select
							options={data}
							clearable={false}
							value={this.state.selected}
							onChange={this.handleChange}
							placeholder={this.props.placeholder}
							searchable
						/>
					</div>
				</div>
			</div>
		);
	}
}

SingleDropdownRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.string.isRequired,
	data: React.PropTypes.any.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	placeholder: React.PropTypes.string,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	style: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	onQueryChange: React.PropTypes.func,
	filterLabel: React.PropTypes.string
};

// Default props value
SingleDropdownRange.defaultProps = {
	style: {},
	URLParams: false,
	showFilter: true
};

// context type
SingleDropdownRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

SingleDropdownRange.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	data: TYPES.OBJECT,
	dataFieldType: TYPES.NUMBER,
	defaultSelected: TYPES.STRING,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	filterLabel: TYPES.STRING
};
