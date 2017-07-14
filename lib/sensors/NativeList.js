function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import ItemCheckboxList from "../addons/ItemCheckboxList";
import ItemList from "../addons/ItemList";
import manager from "../middleware/ChannelManager";
import { StaticSearch } from "../addons/StaticSearch";
import InitialLoader from "../addons/InitialLoader";

var helper = require("../middleware/helper");

var NativeList = function (_Component) {
	_inherits(NativeList, _Component);

	function NativeList(props) {
		_classCallCheck(this, NativeList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
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
		_this.sortObj = {
			aggSort: _this.props.sortBy
		};
		_this.selectAllWhenReady = false;
		_this.previousSelectedSensor = {};
		_this.channelId = null;
		_this.channelListener = null;
		_this.urlParams = helper.URLParams.get(_this.props.componentId, _this.props.multipleSelect);
		_this.handleSelect = _this.handleSelect.bind(_this);
		_this.handleRemove = _this.handleRemove.bind(_this);
		_this.filterBySearch = _this.filterBySearch.bind(_this);
		_this.onSelectAll = _this.onSelectAll.bind(_this);
		_this.type = _this.props.multipleSelect ? "Terms" : "Term";
		_this.customQuery = _this.customQuery.bind(_this);
		_this.defaultCustomQuery = _this.defaultCustomQuery.bind(_this);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	NativeList.prototype.componentWillMount = function componentWillMount() {
		this.size = this.props.size;
		this.setQueryInfo();
		this.createChannel(true);
		this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		this.changeValues(this.defaultValue);
		this.listenFilter();
	};

	NativeList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		this.urlParams = helper.URLParams.get(this.props.componentId, this.props.multipleSelect);
		if (!_.isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.defaultValue = nextProps.defaultSelected;
			this.changeValues(this.defaultValue);
		} else if (this.urlParams !== null) {
			this.defaultValue = this.urlParams;
			this.changeValues(this.defaultValue);
		}
	};

	// build query for this sensor only
	// execute either user defined customQuery or component default query
	// customQuery will receive 2 arguments, selected sensor value and select all.


	NativeList.prototype.customQuery = function customQuery(value) {
		var defaultQuery = this.props.customQuery ? this.props.customQuery : this.defaultCustomQuery;
		return defaultQuery(value);
	};

	NativeList.prototype.defaultCustomQuery = function defaultCustomQuery(value) {
		var query = null;
		if (this.state.selectAll) {
			query = {
				exists: {
					field: [this.props.appbaseField]
				}
			};
		} else if (value) {
			var _type, _listQuery;

			var listQuery = (_listQuery = {}, _listQuery[this.type] = (_type = {}, _type[this.props.appbaseField] = value, _type), _listQuery);
			query = this.props.multipleSelect ? value.length ? listQuery : null : listQuery;
		}
		return query;
	};

	NativeList.prototype.changeValues = function changeValues(defaultValue) {
		var _this2 = this;

		var items = this.state.items;
		if (this.props.selectAllLabel && defaultValue === this.props.selectAllLabel) {
			this.selectAllWhenReady = true;
		} else if (defaultValue !== undefined) {
			items = items.map(function (item) {
				item.key = item.key.toString();
				item.status = defaultValue && defaultValue.indexOf(item.key) > -1 || _this2.selectedValue && _this2.selectedValue.indexOf(item.key) > -1;
				return item;
			});
			this.setState({
				items: items,
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
	};

	// stop streaming request and remove listener when component will unmount


	NativeList.prototype.componentWillUnmount = function componentWillUnmount() {
		this.removeChannel();
	};

	NativeList.prototype.listenFilter = function listenFilter() {
		var _this3 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this3.props.componentId) {
				_this3.changeValues(null);
			}
		});
	};

	NativeList.prototype.removeChannel = function removeChannel() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.loadListener) {
			this.loadListener.remove();
		}
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	// set the query type and input data


	NativeList.prototype.setQueryInfo = function setQueryInfo() {
		var obj = {
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
	};

	NativeList.prototype.includeAggQuery = function includeAggQuery() {
		var obj = {
			key: this.props.componentId + "-sort",
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(obj);
	};

	NativeList.prototype.handleSortSelect = function handleSortSelect() {
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		var obj = {
			key: this.props.componentId + "-sort",
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, "sortChange");
	};

	// Create a channel which passes the react and receive results whenever react changes


	NativeList.prototype.createChannel = function createChannel() {
		var _this4 = this;

		var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		// Set the react - add self aggs query as well with react
		var react = Object.assign({}, this.props.react);
		react.aggs = {
			key: this.props.appbaseField,
			sort: this.props.sortBy,
			size: this.props.size,
			sortRef: this.props.componentId + "-sort"
		};
		var reactAnd = [this.props.componentId + "-sort", "nativeListChanges"];
		react = helper.setupReact(react, reactAnd);
		this.includeAggQuery();
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(this.channelId, function (res) {
			if (res.error) {
				_this4.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery) {
				var data = res.data;
				var rawData = void 0;
				if (res.mode === "streaming") {
					rawData = _this4.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				_this4.setState({
					queryStart: false,
					rawData: rawData
				});
				_this4.setData(rawData);
			}
		});
		if (executeChannel) {
			setTimeout(function () {
				var obj = {
					key: "nativeListChanges",
					value: ""
				};
				helper.selectedSensor.set(obj, true);
			}, 100);
		}
		this.listenLoadingChannel(channelObj);
	};

	NativeList.prototype.listenLoadingChannel = function listenLoadingChannel(channelObj) {
		var _this5 = this;

		this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
			if (res.appliedQuery) {
				_this5.setState({
					queryStart: res.queryState
				});
			}
		});
	};

	NativeList.prototype.setData = function setData(data) {
		if (data.aggregations && data.aggregations[this.props.appbaseField] && data.aggregations[this.props.appbaseField].buckets) {
			this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
		}
	};

	NativeList.prototype.addItemsToList = function addItemsToList(newItems) {
		var _this6 = this;

		var items = [];
		newItems.forEach(function (item) {
			var key = item.key.toString();
			if (key.trim() !== "") {
				item.key = key;
				item.status = !!(_this6.selectedValue && _this6.selectedValue.indexOf(item.key) > -1);
				items.push(item);
			}
		});
		this.setState({
			items: items,
			storedItems: items
		}, function () {
			if (_this6.selectAllWhenReady) {
				_this6.onSelectAll(_this6.props.selectAllLabel);
			}
		});
	};

	// Handler function when a value is selected


	NativeList.prototype.handleSelect = function handleSelect(handleValue) {
		this.setValue(handleValue, true);
	};

	// Handler function when a value is deselected or removed


	NativeList.prototype.handleRemove = function handleRemove(value) {
		this.setValue(value, true);
	};

	// set value


	NativeList.prototype.setValue = function setValue(value) {
		var _this7 = this;

		var isExecuteQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var onUpdate = function onUpdate() {
			if (_this7.props.onValueChange) {
				_this7.props.onValueChange(obj.value);
			}
			var selectedValue = typeof value === "string" ? value.trim() ? value : null : value;
			helper.URLParams.update(_this7.props.componentId, selectedValue, _this7.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		var obj = {
			key: this.props.componentId,
			value: value
		};
		this.selectedValue = value;
		if (this.props.multipleSelect) {
			var items = this.state.items.map(function (item) {
				if (value && value.indexOf(item.key) > -1) {
					item.status = true;
				} else {
					item.status = false;
				}
				return item;
			});
			value = value && value.length ? value : null;
			obj.value = value;
			var isSelectAll = !!(this.selectedValue && this.selectedValue.indexOf(this.props.selectAllLabel) >= 0);
			this.setState({
				items: items,
				defaultSelected: isSelectAll ? [this.props.selectAllLabel] : this.selectedValue,
				selectAll: isSelectAll
			}, function () {
				onUpdate();
			});
		} else {
			this.setState({
				defaultSelected: this.selectedValue,
				selectAll: this.selectedValue && this.selectedValue === this.props.selectAllLabel
			}, function () {
				onUpdate();
			});
		}
	};

	NativeList.prototype.onSelectAll = function onSelectAll(selectedValue) {
		var _this8 = this;

		var items = this.state.items.map(function (item) {
			item.status = true;
			return item;
		});
		this.selectedValue = selectedValue;
		this.setState({
			items: items,
			storedItems: items,
			selectAll: true
		}, function () {
			_this8.setValue(selectedValue, true);
		});
	};

	// filter


	NativeList.prototype.filterBySearch = function filterBySearch(value) {
		if (value) {
			var items = this.state.storedItems.map(function (item) {
				item.visible = !!(item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1);
				return item;
			});
			this.setState({
				items: items
			});
		} else {
			var _items = this.state.storedItems.map(function (item) {
				item.visible = true;
				return item;
			});
			this.setState({
				items: _items
			});
		}
	};

	NativeList.prototype.render = function render() {
		// Checking if component is single select or multiple select
		var listComponent = void 0,
		    searchComponent = null,
		    title = null;

		if (this.state.items.length === 0) {
			return null;
		}

		if (this.props.multipleSelect) {
			listComponent = React.createElement(ItemCheckboxList, {
				items: this.state.items,
				onSelect: this.handleSelect,
				onRemove: this.handleRemove,
				showCount: this.props.showCount,
				showCheckbox: this.props.showCheckbox,
				defaultSelected: this.state.defaultSelected,
				selectAllLabel: this.props.selectAllLabel,
				selectAll: this.state.selectAll,
				onSelectAll: this.onSelectAll
			});
		} else {
			listComponent = React.createElement(ItemList, {
				items: this.state.items,
				onSelect: this.handleSelect,
				onRemove: this.handleRemove,
				showCount: this.props.showCount,
				showRadio: this.props.showRadio,
				defaultSelected: this.state.defaultSelected,
				selectAllLabel: this.props.selectAllLabel,
				selectAll: this.state.selectAll,
				onSelectAll: this.onSelectAll
			});
		}

		// set static search
		if (this.props.showSearch) {
			searchComponent = React.createElement(StaticSearch, {
				placeholder: this.props.placeholder,
				changeCallback: this.filterBySearch
			});
		}

		if (this.props.title) {
			title = React.createElement(
				"h4",
				{ className: "rbc-title col s12 col-xs-12" },
				this.props.title
			);
		}

		var cx = classNames({
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

		return React.createElement(
			"div",
			{ className: "rbc col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
			title,
			searchComponent,
			listComponent,
			this.props.initialLoader && this.state.queryStart ? React.createElement(InitialLoader, { defaultText: this.props.initialLoader }) : null
		);
	};

	return NativeList;
}(Component);

export default NativeList;


NativeList.propTypes = {
	appbaseField: React.PropTypes.string.isRequired,
	componentId: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	size: helper.sizeValidation,
	showCount: React.PropTypes.bool,
	multipleSelect: React.PropTypes.bool,
	sortBy: React.PropTypes.oneOf(["asc", "desc", "count"]),
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	selectAllLabel: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	defaultSelected: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.array]),
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