import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint max-lines: 0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
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
		_this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, props.multipleSelect) : null;
		_this.handleSelect = _this.handleSelect.bind(_this);
		_this.handleRemove = _this.handleRemove.bind(_this);
		_this.filterBySearch = _this.filterBySearch.bind(_this);
		_this.onSelectAll = _this.onSelectAll.bind(_this);
		_this.type = _this.props.multipleSelect && _this.props.queryFormat === "or" ? "terms" : "term";
		_this.customQuery = _this.customQuery.bind(_this);
		_this.defaultCustomQuery = _this.defaultCustomQuery.bind(_this);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	NativeList.prototype.componentWillMount = function componentWillMount() {
		this.setReact(this.props);
		this.size = this.props.size;
		this.setQueryInfo(this.props);
		this.createChannel(true);
		this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		this.previousQuery = null; // initial value for onQueryChange
		this.changeValues(this.defaultValue);
		this.listenFilter();
	};

	NativeList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		this.urlParams = nextProps.URLParams ? helper.URLParams.get(nextProps.componentId, nextProps.multipleSelect) : null;

		if (this.props.queryFormat !== nextProps.queryFormat) {
			this.type = nextProps.multipleSelect && nextProps.queryFormat === "or" ? "terms" : "term";
		}

		if (!_isEqual(this.props.react, nextProps.react) || this.props.size !== nextProps.size) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, nextProps.size, 0, false);
		}

		if (this.sortBy !== nextProps.sortBy) {
			this.sortBy = nextProps.sortBy;
			this.handleSortSelect(nextProps);
		}

		if (!_isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
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
	};

	// build query for this sensor only
	// execute either user defined customQuery or component default query
	// customQuery will receive 2 arguments, selected sensor value and select all.


	NativeList.prototype.customQuery = function customQuery(value) {
		var defaultQuery = this.props.customQuery ? this.props.customQuery : this.defaultCustomQuery;
		var currentQuery = defaultQuery(value);
		if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
			this.props.onQueryChange(this.previousQuery, currentQuery);
			this.previousQuery = currentQuery;
		}
		return currentQuery;
	};

	NativeList.prototype.defaultCustomQuery = function defaultCustomQuery(value) {
		var _this2 = this;

		var query = null;
		if (this.state.selectAll) {
			query = {
				exists: {
					field: [this.props.dataField]
				}
			};
		} else if (value) {
			var listQuery = void 0;
			// queryFormat should not affect SingleList
			if (this.props.queryFormat === "and" && this.props.multipleSelect) {
				// adds a sub-query with must as an array of objects for each term/value
				var queryArray = value.map(function (item) {
					var _this2$type, _ref;

					return _ref = {}, _ref[_this2.type] = (_this2$type = {}, _this2$type[_this2.props.dataField] = item, _this2$type), _ref;
				});
				listQuery = {
					bool: {
						must: queryArray
					}
				};
			} else {
				var _type, _listQuery;

				// for the default queryFormat = "or" and SingleList
				listQuery = (_listQuery = {}, _listQuery[this.type] = (_type = {}, _type[this.props.dataField] = value, _type), _listQuery);
			}

			query = this.props.multipleSelect ? value.length ? listQuery : null : listQuery;
		}
		return query;
	};

	NativeList.prototype.changeValues = function changeValues(defaultValue) {
		var _this3 = this;

		var items = this.state.items;
		if (this.props.selectAllLabel && defaultValue === this.props.selectAllLabel) {
			this.selectAllWhenReady = true;
		} else if (defaultValue !== undefined) {
			items = items.map(function (item) {
				item.key = item.key.toString();
				item.status = defaultValue && defaultValue.indexOf(item.key) > -1 || _this3.selectedValue && _this3.selectedValue.indexOf(item.key) > -1;
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
			this.handleSortSelect(this.props);
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
		var _this4 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this4.props.componentId) {
				_this4.changeValues(null);
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


	NativeList.prototype.setQueryInfo = function setQueryInfo(props) {
		var obj = {
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
	};

	NativeList.prototype.includeAggQuery = function includeAggQuery() {
		var obj = {
			key: this.props.componentId + "-sort",
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(obj);
	};

	NativeList.prototype.handleSortSelect = function handleSortSelect(props) {
		this.sortObj = {
			aggSort: props.sortBy
		};
		var obj = {
			key: props.componentId + "-sort",
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, "sortChange");
	};

	NativeList.prototype.setReact = function setReact(props) {
		// Set the react - add self aggs query as well with react
		var react = Object.assign({}, props.react);
		react.aggs = {
			key: props.dataField,
			sort: props.sortBy,
			size: props.size,
			sortRef: props.componentId + "-sort"
		};
		var reactAnd = [props.componentId + "-sort", "nativeListChanges"];
		this.react = helper.setupReact(react, reactAnd);
	};

	// Create a channel which passes the react and receive results whenever react changes


	NativeList.prototype.createChannel = function createChannel() {
		var _this5 = this;

		var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		this.includeAggQuery();
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(this.channelId, function (res) {
			if (res.error) {
				_this5.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery) {
				var data = res.data;
				var rawData = void 0;
				if (res.mode === "streaming") {
					rawData = _this5.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				_this5.setState({
					queryStart: false,
					rawData: rawData
				});
				_this5.setData(rawData);
			}
		});
		this.listenLoadingChannel(channelObj);
	};

	NativeList.prototype.listenLoadingChannel = function listenLoadingChannel(channelObj) {
		var _this6 = this;

		this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
			if (res.appliedQuery) {
				_this6.setState({
					queryStart: res.queryState
				});
			}
		});
	};

	NativeList.prototype.setData = function setData(data) {
		if (data.aggregations && data.aggregations[this.props.dataField] && data.aggregations[this.props.dataField].buckets) {
			this.addItemsToList(data.aggregations[this.props.dataField].buckets);
		}
	};

	NativeList.prototype.addItemsToList = function addItemsToList(newItems) {
		var _this7 = this;

		var items = [];
		newItems.forEach(function (item) {
			var key = item.key.toString();
			if (key.trim() !== "") {
				item.key = key;
				item.status = !!(_this7.selectedValue && _this7.selectedValue.indexOf(item.key) > -1);
				items.push(item);
			}
		});
		this.setState({
			items: items,
			storedItems: items
		}, function () {
			if (_this7.selectAllWhenReady) {
				_this7.onSelectAll(_this7.props.selectAllLabel);
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
		var _this8 = this;

		var isExecuteQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var onUpdate = function onUpdate() {
			var execQuery = function execQuery() {
				if (_this8.props.onValueChange) {
					_this8.props.onValueChange(value);
				}
				var selectedValue = typeof value === "string" ? value.trim() ? value : null : value;
				if (_this8.props.URLParams) {
					helper.URLParams.update(_this8.props.componentId, selectedValue, _this8.props.URLParams);
				}
				helper.selectedSensor.set(obj, isExecuteQuery);
			};

			if (_this8.props.beforeValueChange) {
				_this8.props.beforeValueChange(value).then(function () {
					execQuery();
				}).catch(function (e) {
					console.warn(_this8.props.componentId + " - beforeValueChange rejected the promise with", e);
				});
			} else {
				execQuery();
			}
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
		var _this9 = this;

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
			_this9.setValue(selectedValue, true);
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
		}, this.props.className);

		return React.createElement(
			"div",
			{ className: "rbc col s12 col-xs-12 card thumbnail " + cx, style: this.props.style },
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
	dataField: PropTypes.string.isRequired,
	componentId: PropTypes.string.isRequired,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	size: helper.sizeValidation,
	showCount: PropTypes.bool,
	multipleSelect: PropTypes.bool,
	sortBy: PropTypes.oneOf(["asc", "desc", "count"]),
	showSearch: PropTypes.bool,
	placeholder: PropTypes.string,
	selectAllLabel: PropTypes.string,
	customQuery: PropTypes.func,
	initialLoader: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	defaultSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
	react: PropTypes.object,
	beforeValueChange: PropTypes.func,
	onValueChange: PropTypes.func,
	onQueryChange: PropTypes.func,
	style: PropTypes.object,
	showRadio: PropTypes.bool,
	showCheckbox: PropTypes.bool,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	filterLabel: PropTypes.string,
	queryFormat: PropTypes.oneOf(["and", "or"]),
	className: PropTypes.string
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
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired,
	reactiveId: PropTypes.number
};