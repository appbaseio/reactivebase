import React, { Component } from "react";
import Select from "react-select";
import classNames from "classnames";
import _ from "lodash";
import manager from "../middleware/ChannelManager";
import InitialLoader from "../addons/InitialLoader";

const helper = require("../middleware/helper");

export default class DropdownList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			value: "",
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.selectAll = false;
		this.channelId = null;
		this.channelListener = null;
		this.previousSelectedSensor = {};
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, props.multipleSelect) : null;
		this.handleChange = this.handleChange.bind(this);
		this.type = this.props.multipleSelect && this.props.queryFormat === "or" ? "terms" : "term";
		this.customQuery = this.customQuery.bind(this);
		this.renderOption = this.renderOption.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setReact(this.props);
		this.size = this.props.size;
		this.setQueryInfo(this.props);
		this.checkDefault(this.props);
		this.createChannel(true);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		const { items } = this.state;

		if (!_.isEqual(this.props.react, nextProps.react) || this.props.size !== nextProps.size) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, nextProps.size, 0, false);
		}

		if (this.props.queryFormat !== nextProps.queryFormat) {
			this.type = nextProps.multipleSelect && nextProps.queryFormat === "or" ? "terms" : "term";
		}

		if (this.sortBy !== nextProps.sortBy) {
			this.sortBy = nextProps.sortBy;
			this.handleSortSelect(nextProps);
		}

		if (nextProps.multipleSelect && !_.isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.changeValue(nextProps.defaultSelected);
		} else if (!nextProps.multipleSelect && this.props.defaultSelected !== nextProps.defaultSelected) {
			this.changeValue(nextProps.defaultSelected);
		}

		if (nextProps.selectAllLabel !== this.props.selectAllLabel) {
			if (this.props.selectAllLabel) {
				items.shift();
			}
			items.unshift({ label: nextProps.selectAllLabel, value: nextProps.selectAllLabel });
			this.setState({
				items
			});
		}

		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.setValue(this.state.value, true);
		}
	}

	componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
		// stop streaming request and remove listener when component will unmount
		this.removeChannel();
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
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, props.multipleSelect) : null;
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (this.props.multipleSelect) {
			if (!_.isEqual(this.defaultSelected, defaultValue)) {
				this.defaultSelected = defaultValue;
				const records = this.state.items.filter(record => this.defaultSelected.indexOf(record.value) > -1);
				if (records.length) {
					this.handleChange(records);
				} else {
					this.handleChange(this.defaultSelected.map(item => ({
						value: item
					})));
				}
			}
		} else if (this.defaultSelected !== defaultValue) {
			this.defaultSelected = defaultValue;
			const records = this.state.items.filter(record => record.value === this.defaultSelected);

			if (records.length) {
				this.handleChange(records[0]);	// multipleSelect is false
			} else {
				this.handleChange({value: this.defaultSelected});
			}
		}
		if (this.sortBy !== this.props.sortBy) {
			this.sortBy = this.props.sortBy;
			this.handleSortSelect(this.props);
		}
		if (this.size !== this.props.size) {
			this.size = this.props.size;
			this.removeChannel();
			this.createChannel();
		}
	}

	removeChannel() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.loadListener) {
			this.loadListener.remove();
		}
	}

	// build query for this sensor only
	customQuery(value) {
		if (this.selectAll) {
			return {
				exists: {
					field: [this.props.dataField]
				}
			};
		} else if (value) {
			// queryFormat should not affect SingleDropdownList
			if (this.props.queryFormat === "and" && this.props.multipleSelect) {
				// adds a sub-query with must as an array of objects for each terms/value
				const queryArray = value.map(item => (
					{
						[this.type]: {
							[this.props.dataField]: item
						}
					}
				));
				return {
					bool: {
						must: queryArray
					}
				};
			}

			// for the default queryFormat = "or" and SingleDropdownList
			return {
				[this.type]: {
					[this.props.dataField]: value
				}
			};
		}
		return null;
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
				component: props.component,
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	includeAggQuery() {
		const obj = {
			key: `${this.props.componentId}-sort`,
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(obj);
	}

	handleSortSelect(props) {
		this.sortObj = {
			aggSort: props.sortBy
		};
		const obj = {
			key: `${props.componentId}-sort`,
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, "sortChange");
	}

	setReact(props) {
		// Set the react - add self aggs query as well with react
		const react = Object.assign({}, props.react);
		react.aggs = {
			key: props.dataField,
			sort: props.sortBy,
			size: props.size,
			sortRef: `${props.componentId}-sort`
		};
		const reactAnd = [`${props.componentId}-sort`, "dropdownListChanges"]
		this.react = helper.setupReact(react, reactAnd);
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel(executeChannel = false) {
		this.includeAggQuery();
		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, (res) => {
			if (res.error) {
				this.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery) {
				const data = res.data;
				let rawData;
				if (res.mode === "streaming") {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				this.setState({
					queryStart: false,
					rawData
				});
				this.setData(rawData);
			}
		});
		this.listenLoadingChannel(channelObj);
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(`${channelObj.channelId}-query`, (res) => {
			if (res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		});
	}

	setData(data) {
		if (data.aggregations && data.aggregations[this.props.dataField] && data.aggregations[this.props.dataField].buckets) {
			this.addItemsToList(data.aggregations[this.props.dataField].buckets);
		}
	}

	renderOption(option) {
		return (
			<span key={option.value}>{option.value} {this.props.showCount && option.count ? (<span className="rbc-count">{option.count}</span>) : null}</span>
		);
	}

	addItemsToList(newItems) {
		newItems = newItems.map((item) => {
			item.label = item.key.toString();
			item.value = item.key.toString();
			item.count = item.doc_count;
			return item;
		});
		newItems = newItems.filter(item => item && item.label && item.label.trim());
		if (this.props.selectAllLabel) {
			newItems.unshift({ label: this.props.selectAllLabel, value: this.props.selectAllLabel });
		}
		this.setState({
			items: newItems
		});
		if (this.defaultSelected) {
			if (this.props.multipleSelect) {
				const records = this.state.items.filter(record => this.defaultSelected.indexOf(record.value) > -1);
				if (records.length) {
					this.handleChange(records);
				}
			} else {
				const records = this.state.items.filter(record => record.value === this.defaultSelected);
				if (records.length) {
					this.handleChange(records[0]);
				}
			}
		}
	}

	// Handler function when a value is selected
	handleChange(value) {
		let result;
		this.selectAll = false;
		if (this.props.multipleSelect) {
			if (value) {
				result = value.map(item => item.value);

				if (this.props.selectAllLabel && (result.indexOf(this.props.selectAllLabel) > -1)) {
					result = this.props.selectAllLabel;
					this.selectAll = true;
				}
			} else {
				result = null;
			}
		} else {
			result = value ? value.value : value;
			if (this.props.selectAllLabel && result === this.props.selectAllLabel) {
				this.selectAll = true;
			}
		}

		// string for single and array for multiple
		this.setState({
			value: result
		});

		this.setValue(result, true);
	}

	// set value
	setValue(value, isExecuteQuery = false) {
		if (this.props.multipleSelect && value) {
			value = value.length ? value : null;
		}
		value = value === "" ? null : value;
		const obj = {
			key: this.props.componentId,
			value
		};

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(value);
			}
			if(this.props.URLParams){
				helper.URLParams.update(this.props.componentId, value, this.props.URLParams);
			}
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

	render() {
		// Checking if component is single select or multiple select
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder,
			"rbc-multidropdownlist": this.props.multipleSelect,
			"rbc-singledropdownlist": !this.props.multipleSelect,
			"rbc-count-active": this.props.showCount,
			"rbc-count-inactive": !this.props.showCount,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		}, this.props.className);

		if (this.state.items.length) {
			return (
				<div className={`rbc col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
					<div className="row">
						{title}
						<div className="col s12 col-xs-12">
							<Select
								options={this.state.items}
								clearable={false}
								value={this.state.value}
								onChange={this.handleChange}
								multi={this.props.multipleSelect}
								cache={false}
								placeholder={this.props.placeholder}
								optionRenderer={this.renderOption}
								searchable
							/>
						</div>
					</div>
					{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader} />) : null}
				</div>
			);
		}

		return null;
	}
}

DropdownList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	size: helper.sizeValidation,
	multipleSelect: React.PropTypes.bool,
	showCount: React.PropTypes.bool,
	sortBy: React.PropTypes.oneOf(["asc", "desc", "count"]),
	placeholder: React.PropTypes.string,
	selectAllLabel: React.PropTypes.string,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	defaultSelected: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.array
	]),
	customQuery: React.PropTypes.func,
	react: React.PropTypes.object,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	onQueryChange: React.PropTypes.func,
	style: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	queryFormat: React.PropTypes.oneOf(["and", "or"]),
	className: React.PropTypes.string
};

// Default props value
DropdownList.defaultProps = {
	showCount: true,
	sortBy: "count",
	size: 100,
	title: null,
	placeholder: "Select...",
	selectAllLabel: null,
	URLParams: false,
	showFilter: true,
	queryFormat: "or"
};

// context type
DropdownList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};
