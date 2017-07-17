/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
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
		this.urlParams = helper.URLParams.get(this.props.componentId, this.props.multipleSelect);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.filterBySearch = this.filterBySearch.bind(this);
		this.onSelectAll = this.onSelectAll.bind(this);
		this.type = this.props.multipleSelect ? "Terms" : "Term";
		this.customQuery = this.customQuery.bind(this);
		this.defaultCustomQuery = this.defaultCustomQuery.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.size = this.props.size;
		this.setQueryInfo();
		this.createChannel(true);
		this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		this.changeValues(this.defaultValue);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		this.urlParams = helper.URLParams.get(this.props.componentId, this.props.multipleSelect);
		if (!_.isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.defaultValue = nextProps.defaultSelected;
			this.changeValues(this.defaultValue);
		} else if (this.urlParams !== null) {
			this.defaultValue = this.urlParams;
			this.changeValues(this.defaultValue);
		}
	}

	// build query for this sensor only
	// execute either user defined customQuery or component default query
	// customQuery will receive 2 arguments, selected sensor value and select all.
	customQuery(value) {
		const defaultQuery = this.props.customQuery ? this.props.customQuery : this.defaultCustomQuery;
		return defaultQuery(value);
	}

	defaultCustomQuery(value) {
		let query = null;
		if (this.state.selectAll) {
			query = {
				exists: {
					field: [this.props.appbaseField]
				}
			};
		} else if (value) {
			const listQuery = {
				[this.type]: {
					[this.props.appbaseField]: value
				}
			};
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
			this.handleSortSelect();
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
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: this.props.component,
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
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

	handleSortSelect() {
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		const obj = {
			key: `${this.props.componentId}-sort`,
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, "sortChange");
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel(executeChannel = false) {
		// Set the react - add self aggs query as well with react
		let react = Object.assign({}, this.props.react);
		react.aggs = {
			key: this.props.appbaseField,
			sort: this.props.sortBy,
			size: this.props.size,
			sortRef: `${this.props.componentId}-sort`
		};
		const reactAnd = [`${this.props.componentId}-sort`, "nativeListChanges"]
		this.react = helper.setupReact(react, reactAnd);
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
		if (executeChannel) {
			setTimeout(() => {
				const obj = {
					key: "nativeListChanges",
					value: ""
				};
				helper.selectedSensor.set(obj, true);
			}, 100);
		}
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
		if (data.aggregations && data.aggregations[this.props.appbaseField] && data.aggregations[this.props.appbaseField].buckets) {
			this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
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
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			const selectedValue = typeof value === "string" ? ( value.trim() ? value : null ) : value;
			helper.URLParams.update(this.props.componentId, selectedValue, this.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
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
		});

		return (
			<div className={`rbc col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.componentStyle}>
				{title}
				{searchComponent}
				{listComponent}
				{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader} />) : null}
			</div>
		);
	}
}

NativeList.propTypes = {
	appbaseField: React.PropTypes.string.isRequired,
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
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	showRadio: React.PropTypes.bool,
	showCheckbox: React.PropTypes.bool,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
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
	componentStyle: {},
	showRadio: true,
	showCheckbox: true,
	URLParams: false,
	showFilter: true
};

// context type
NativeList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};
