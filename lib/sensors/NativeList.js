var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

		var _this = _possibleConstructorReturn(this, (NativeList.__proto__ || Object.getPrototypeOf(NativeList)).call(this, props));

		_this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			queryStart: false,
			defaultSelectAll: false
		};
		_this.sortObj = {
			aggSort: _this.props.sortBy
		};
		_this.previousSelectedSensor = {};
		_this.channelId = null;
		_this.channelListener = null;
		_this.defaultSelected = _this.props.defaultSelected;
		_this.handleSelect = _this.handleSelect.bind(_this);
		_this.handleRemove = _this.handleRemove.bind(_this);
		_this.filterBySearch = _this.filterBySearch.bind(_this);
		_this.selectAll = _this.selectAll.bind(_this);
		_this.type = _this.props.multipleSelect ? "Terms" : "Term";
		_this.customQuery = _this.customQuery.bind(_this);
		_this.defaultCustomQuery = _this.defaultCustomQuery.bind(_this);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(NativeList, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.size = this.props.size;
			this.setQueryInfo();
			this.handleSelect("");
			this.createChannel(true);
		}

		// build query for this sensor only
		// execute either user defined customQuery or component default query
		// customQuery will receive 2 arguments, selected sensor value and select all.

	}, {
		key: "customQuery",
		value: function customQuery(value) {
			var defaultQuery = this.props.customQuery ? this.props.customQuery : this.defaultCustomQuery;
			return defaultQuery(value, this.state.selectAll);
		}
	}, {
		key: "defaultCustomQuery",
		value: function defaultCustomQuery(value, selectAll) {
			var query = null;
			if (selectAll) {
				query = {
					exists: {
						field: [this.props.appbaseField]
					}
				};
			} else if (value) {
				var listQuery = _defineProperty({}, this.type, _defineProperty({}, this.props.appbaseField, value));
				query = this.props.multipleSelect ? value.length ? listQuery : null : listQuery;
			}
			return query;
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			var _this2 = this;

			setTimeout(function () {
				if (_this2.defaultSelected !== _this2.props.defaultSelected) {
					_this2.defaultSelected = _this2.props.defaultSelected;
					var items = _this2.state.items;
					items = items.map(function (item) {
						item.key = item.key.toString();
						item.status = !!(_this2.defaultSelected && _this2.defaultSelected.indexOf(item.key) > -1 || _this2.selectedValue && _this2.selectedValue.indexOf(item.key) > -1);
						return item;
					});
					_this2.setState({
						items: items,
						storedItems: items
					});
					setTimeout(_this2.handleSelect.bind(_this2, _this2.defaultSelected), 1000);
				}
				if (_this2.sortBy !== _this2.props.sortBy) {
					_this2.sortBy = _this2.props.sortBy;
					_this2.handleSortSelect();
				}
				if (_this2.size !== _this2.props.size) {
					_this2.size = _this2.props.size;
					_this2.removeChannel();
					_this2.createChannel();
				}
			}, 300);
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			this.removeChannel();
		}
	}, {
		key: "removeChannel",
		value: function removeChannel() {
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

		// set the query type and input data

	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField,
					customQuery: this.customQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}
	}, {
		key: "includeAggQuery",
		value: function includeAggQuery() {
			var obj = {
				key: this.props.componentId + "-sort",
				value: this.sortObj
			};
			helper.selectedSensor.setSortInfo(obj);
		}
	}, {
		key: "handleSortSelect",
		value: function handleSortSelect() {
			this.sortObj = {
				aggSort: this.props.sortBy
			};
			var obj = {
				key: this.props.componentId + "-sort",
				value: this.sortObj
			};
			helper.selectedSensor.set(obj, true, "sortChange");
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this3 = this;

			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			react.aggs = {
				key: this.props.appbaseField,
				sort: this.props.sortBy,
				size: this.props.size,
				sortRef: this.props.componentId + "-sort"
			};
			if (react && react.and && typeof react.and === "string") {
				react.and = [react.and];
			} else {
				react.and = react.and ? react.and : [];
			}
			react.and.push(this.props.componentId + "-sort");
			react.and.push("nativeListChanges");
			this.includeAggQuery();
			// create a channel and listen the changes
			var channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(this.channelId, function (res) {
				if (res.error) {
					_this3.setState({
						queryStart: false
					});
				}
				if (res.appliedQuery) {
					var data = res.data;
					var rawData = void 0;
					if (res.mode === "streaming") {
						rawData = _this3.state.rawData;
						rawData.hits.hits.push(res.data);
					} else if (res.mode === "historic") {
						rawData = data;
					}
					_this3.setState({
						queryStart: false,
						rawData: rawData
					});
					_this3.setData(rawData);
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
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj) {
			var _this4 = this;

			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					_this4.setState({
						queryStart: res.queryState
					});
				}
			});
		}
	}, {
		key: "setData",
		value: function setData(data) {
			if (data.aggregations && data.aggregations[this.props.appbaseField] && data.aggregations[this.props.appbaseField].buckets) {
				this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
			}
		}
	}, {
		key: "addItemsToList",
		value: function addItemsToList(newItems) {
			var _this5 = this;

			newItems = newItems.map(function (item) {
				item.key = item.key.toString();
				item.status = !!(_this5.selectedValue && _this5.selectedValue.indexOf(item.key) > -1);
				return item;
			});
			this.setState({
				items: newItems,
				storedItems: newItems
			});
		}

		// Handler function when a value is selected

	}, {
		key: "handleSelect",
		value: function handleSelect(handleValue) {
			var selectAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (this.state.selectAll && !selectAll) {
				this.setState({
					selectAll: false
				});
			}
			this.setValue(handleValue, true);
		}

		// Handler function when a value is deselected or removed

	}, {
		key: "handleRemove",
		value: function handleRemove(value) {
			var isExecuteQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.setValue(value, isExecuteQuery);
		}

		// set value

	}, {
		key: "setValue",
		value: function setValue(value) {
			var isExecuteQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
				this.setState({ items: items });
			}
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// selectAll

	}, {
		key: "selectAll",
		value: function selectAll(value, selectedValue, cb) {
			var items = this.state.items.map(function (item) {
				item.status = value;
				return item;
			});
			if (value) {
				this.selectedValue = selectedValue;
			}
			this.setState({
				items: items,
				storedItems: items,
				defaultSelectAll: value,
				selectAll: value
			}, cb);
		}

		// filter

	}, {
		key: "filterBySearch",
		value: function filterBySearch(value) {
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
		}
	}, {
		key: "render",
		value: function render() {
			// Checking if component is single select or multiple select
			var listComponent = void 0,
			    searchComponent = null,
			    title = null;

			if (this.props.multipleSelect) {
				listComponent = React.createElement(ItemCheckboxList, {
					items: this.state.items,
					onSelect: this.handleSelect,
					onRemove: this.handleRemove,
					showCount: this.props.showCount,
					selectAll: this.selectAll,
					defaultSelected: this.props.defaultSelected,
					selectAllLabel: this.props.selectAllLabel,
					selectAllValue: this.state.selectAll
				});
			} else {
				listComponent = React.createElement(ItemList, {
					items: this.state.items,
					onSelect: this.handleSelect,
					onRemove: this.handleRemove,
					showCount: this.props.showCount,
					defaultSelected: this.props.defaultSelected,
					selectAllLabel: this.props.selectAllLabel,
					selectAll: this.selectAll
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
		}
	}]);

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
	componentStyle: React.PropTypes.object
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
	componentStyle: {}
};

// context type
NativeList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};