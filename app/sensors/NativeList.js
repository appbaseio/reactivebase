/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import _ from "lodash";
import ItemCheckboxList from "../addons/ItemCheckboxList";
import ItemList from "../addons/ItemList";
import manager from "../middleware/ChannelManager";
import { StaticSearch } from "../addons/StaticSearch";
import InitialLoader from "../addons/InitialLoader";

const helper = require("../middleware/helper");

export default class NativeList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			queryStart: false,
			defaultSelected: null,
			selectAll: false
		};
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.selectAllWhenReady = false;
		this.previousSelectedSensor = {};
		this.channelId = null;
		this.channelListener = null;
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, props.multipleSelect) : null;
		this.handleSelect = this.handleSelect.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.filterBySearch = this.filterBySearch.bind(this);
		this.onSelectAll = this.onSelectAll.bind(this);
		this.type = this.props.multipleSelect && this.props.queryFormat === "or" ? "Terms" : "Term";
		this.customQuery = this.customQuery.bind(this);
		this.defaultCustomQuery = this.defaultCustomQuery.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.setReact(this.props);
		this.size = this.props.size;
		this.setQueryInfo(this.props);
		this.createChannel(true);
		this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		this.previousQuery = null;	// initial value for onQueryChange
		this.changeValues(this.defaultValue);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		this.urlParams = helper.URLParams.get(nextProps.componentId, nextProps.multipleSelect);

		if (this.props.queryFormat !== nextProps.queryFormat) {
			this.type = nextProps.multipleSelect && nextProps.queryFormat === "or" ? "Terms" : "Term";
		}

		if (!_.isEqual(this.props.react, nextProps.react) || this.props.size !== nextProps.size) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, nextProps.size, 0, false);
		}

		if (this.sortBy !== nextProps.sortBy) {
			this.sortBy = nextProps.sortBy;
			this.handleSortSelect(nextProps);
		}

		if (!_.isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.defaultValue = nextProps.defaultSelected;
			this.changeValues(this.defaultValue);
		} else if (this.urlParams !== null) {
			this.defaultValue = this.urlParams;
			this.changeValues(this.defaultValue);
		}

		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.setValue(this.state.defaultSelected, true);
		}
	}

	// build query for this sensor only
	// execute either user defined customQuery or component default query
	// customQuery will receive 2 arguments, selected sensor value and select all.
	customQuery(value) {
		const defaultQuery = this.props.customQuery ? this.props.customQuery : this.defaultCustomQuery;
		const currentQuery = defaultQuery(value);
		if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
			this.props.onQueryChange(this.previousQuery, currentQuery);
			this.previousQuery = currentQuery;
		}
		return currentQuery;
	}

	defaultCustomQuery(value) {
		let query = null;
		if (this.state.selectAll) {
			query = {
				exists: {
					field: [this.props.dataField]
				}
			};
		} else if (value) {
			let listQuery;
			// queryFormat should not affect SingleList
			if (this.props.queryFormat === "and" && this.props.multipleSelect) {
				// adds a sub-query with must as an array of objects for each term/value
				const queryArray = value.map(item => (
					{
						[this.type]: {
							[this.props.dataField]: item
						}
					}
				));
				listQuery = {
					bool: {
						must: queryArray
					}
				};
			} else {
				// for the default queryFormat = "or" and SingleList
				listQuery = {
					[this.type]: {
						[this.props.dataField]: value
					}
				};
			}

			query = this.props.multipleSelect ? (value.length ? listQuery : null) : listQuery;
		}
		return query;
	}

	changeValues(defaultValue) {
		let items = this.state.items;
		if (this.props.selectAllLabel && defaultValue === this.props.selectAllLabel) {
			this.selectAllWhenReady = true;
		} else if (defaultValue !== undefined) {
			items = items.map((item) => {
				item.key = item.key.toString();
				item.status = ((defaultValue && defaultValue.indexOf(item.key) > -1) || (this.selectedValue && this.selectedValue.indexOf(item.key) > -1));
				return item;
			});
			this.setState({
				items,
				storedItems: items
			});
			this.handleSelect(defaultValue);
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

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		this.removeChannel();
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.changeValues(null);
			}
		});
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
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	// set the query type and input data
	setQueryInfo(props) {
		const obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.dataField,
				customQuery: this.customQuery,
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
		const reactAnd = [`${props.componentId}-sort`, "nativeListChanges"];
		this.react = helper.setupReact(react, reactAnd);
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel(executeChannel = false) {
		this.includeAggQuery();
		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(this.channelId, (res) => {
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

	addItemsToList(newItems) {
		let items = [];
		newItems.forEach((item) => {
			const key = item.key.toString();
			if (key.trim() !== "") {
				item.key = key;
				item.status = !!((this.selectedValue && this.selectedValue.indexOf(item.key) > -1));
				items.push(item);
			}
		});
		this.setState({
			items,
			storedItems: items
		}, () => {
			if (this.selectAllWhenReady) {
				this.onSelectAll(this.props.selectAllLabel);
			}
		});
	}

	// Handler function when a value is selected
	handleSelect(handleValue) {
		this.setValue(handleValue, true);
	}

	// Handler function when a value is deselected or removed
	handleRemove(value) {
		this.setValue(value, true);
	}

	// set value
	setValue(value, isExecuteQuery = false) {
		const onUpdate = () => {
			const execQuery = () => {
				if (this.props.onValueChange) {
					this.props.onValueChange(value);
				}
				const selectedValue = typeof value === "string" ? ( value.trim() ? value : null ) : value;
				helper.URLParams.update(this.props.componentId, selectedValue, this.props.URLParams);
				helper.selectedSensor.set(obj, isExecuteQuery);
			};

			if (this.props.beforeValueChange) {
				this.props.beforeValueChange(value)
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

		const obj = {
			key: this.props.componentId,
			value
		};

		this.selectedValue = value;
		if (this.props.multipleSelect) {
			const items = this.state.items.map((item) => {
				if (value && value.indexOf(item.key) > -1) {
					item.status = true;
				} else {
					item.status = false;
				}
				return item;
			});

			value = value && value.length ? value : null;
			obj.value = value;
			const isSelectAll = !!(this.selectedValue && this.selectedValue.indexOf(this.props.selectAllLabel) >= 0);

			this.setState({
				items,
				defaultSelected: isSelectAll ? [this.props.selectAllLabel] : this.selectedValue,
				selectAll: isSelectAll
			}, () => {
				onUpdate();
			});
		} else {
			this.setState({
				defaultSelected: this.selectedValue,
				selectAll: this.selectedValue && this.selectedValue === this.props.selectAllLabel
			}, () => {
				onUpdate();
			});
		}
	}

	onSelectAll(selectedValue) {
		const items = this.state.items.map((item) => {
			item.status = true;
			return item;
		});
		this.selectedValue = selectedValue;
		this.setState({
			items,
			storedItems: items,
			selectAll: true
		}, () => {
			this.setValue(selectedValue, true);
		});
	}

	// filter
	filterBySearch(value) {
		if (value) {
			const items = this.state.storedItems.map((item) => {
				item.visible = !!(item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1);
				return item;
			});
			this.setState({
				items
			});
		} else {
			const items = this.state.storedItems.map((item) => {
				item.visible = true;
				return item;
			});
			this.setState({
				items
			});
		}
	}

	render() {
		// Checking if component is single select or multiple select
		let listComponent,
			searchComponent = null,
			title = null;

		if (this.state.items.length === 0) {
			return null;
		}

		if (this.props.multipleSelect) {
			listComponent = (<ItemCheckboxList
				items={this.state.items}
				onSelect={this.handleSelect}
				onRemove={this.handleRemove}
				showCount={this.props.showCount}
				showCheckbox={this.props.showCheckbox}
				defaultSelected={this.state.defaultSelected}
				selectAllLabel={this.props.selectAllLabel}
				selectAll={this.state.selectAll}
				onSelectAll={this.onSelectAll}
			/>);
		} else {
			listComponent = (<ItemList
				items={this.state.items}
				onSelect={this.handleSelect}
				onRemove={this.handleRemove}
				showCount={this.props.showCount}
				showRadio={this.props.showRadio}
				defaultSelected={this.state.defaultSelected}
				selectAllLabel={this.props.selectAllLabel}
				selectAll={this.state.selectAll}
				onSelectAll={this.onSelectAll}
			/>);
		}

		// set static search
		if (this.props.showSearch) {
			searchComponent = (<StaticSearch
				placeholder={this.props.placeholder}
				changeCallback={this.filterBySearch}
			/>);
		}

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-search-active": this.props.showSearch,
			"rbc-search-inactive": !this.props.showSearch,
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder,
			"rbc-singlelist": !this.props.multipleSelect,
			"rbc-multilist": this.props.multipleSelect,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		}, this.props.className);

		return (
			<div className={`rbc col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.style}>
				{title}
				{searchComponent}
				{listComponent}
				{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader} />) : null}
			</div>
		);
	}
}

NativeList.propTypes = {
	dataField: React.PropTypes.string.isRequired,
	componentId: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	size: helper.sizeValidation,
	showCount: React.PropTypes.bool,
	multipleSelect: React.PropTypes.bool,
	sortBy: React.PropTypes.oneOf(["asc", "desc", "count"]),
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	selectAllLabel: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	defaultSelected: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
		React.PropTypes.array
	]),
	react: React.PropTypes.object,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	onQueryChange: React.PropTypes.func,
	style: React.PropTypes.object,
	showRadio: React.PropTypes.bool,
	showCheckbox: React.PropTypes.bool,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	queryFormat: React.PropTypes.oneOf(["and", "or"]),
	className: React.PropTypes.string
};

// Default props value
NativeList.defaultProps = {
	showCount: true,
	multipleSelect: true,
	sortBy: "count",
	size: 100,
	showSearch: false,
	title: null,
	placeholder: "Search",
	selectAllLabel: null,
	style: {},
	showRadio: true,
	showCheckbox: true,
	URLParams: false,
	showFilter: true,
	queryFormat: "or"
};

// context type
NativeList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};
