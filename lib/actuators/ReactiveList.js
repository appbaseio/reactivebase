import _uniqBy from "lodash/uniqBy";
import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import JsonPrint from "../addons/JsonPrint";
import PoweredBy from "../sensors/PoweredBy";
import InitialLoader from "../addons/InitialLoader";
import NoResults from "../addons/NoResults";
import ResultStats from "../addons/ResultStats";
import Pagination from "../addons/Pagination";
import * as TYPES from "../middleware/constants";


var helper = require("../middleware/helper");
var $ = require("jquery");

var ReactiveList = function (_Component) {
	_inherits(ReactiveList, _Component);

	function ReactiveList(props) {
		_classCallCheck(this, ReactiveList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			markers: [],
			query: {},
			currentData: [],
			resultMarkup: [],
			isLoading: false,
			queryStart: false,
			resultStats: {
				resultFound: false,
				total: 0,
				took: 0
			},
			showPlaceholder: true,
			showInitialLoader: false,
			requestOnScroll: !_this.props.pagination
		};
		if (_this.props.sortOptions) {
			var _this$sortObj;

			var obj = _this.props.sortOptions[0];
			_this.sortObj = (_this$sortObj = {}, _this$sortObj[obj.appbaseField] = {
				order: obj.sortBy
			}, _this$sortObj);
		} else if (_this.props.sortBy) {
			var _this$sortObj2;

			_this.sortObj = (_this$sortObj2 = {}, _this$sortObj2[_this.props.appbaseField] = {
				order: _this.props.sortBy
			}, _this$sortObj2);
		}
		_this.resultSortKey = "ResultSort";
		_this.channelId = null;
		_this.channelListener = null;
		_this.queryStartTime = 0;
		_this.handleSortSelect = _this.handleSortSelect.bind(_this);
		_this.nextPage = _this.nextPage.bind(_this);
		_this.appliedQuery = {};
		return _this;
	}

	ReactiveList.prototype.componentWillMount = function componentWillMount() {
		this.streamProp = this.props.stream;
		this.size = this.props.size;
		this.initialize();
	};

	ReactiveList.prototype.componentWillUpdate = function componentWillUpdate() {
		if (this.streamProp !== this.props.stream) {
			this.streamProp = this.props.stream;
		}
		if (this.size !== this.props.size) {
			this.size = this.props.size;
			this.setState({
				currentData: []
			});
		}
		if (this.props.pagination && this.paginationAtVal !== this.props.paginationAt) {
			this.paginationAtVal = this.props.paginationAt;
			this.executePaginationUpdate();
		}
	};

	ReactiveList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (!_isEqual(this.props, nextProps)) {
			this.setReact(nextProps);
			var size = null,
			    from = null;
			if (this.props.size !== nextProps.size || this.props.from != nextProps.from) {
				size = nextProps.size;
				from = nextProps.from;
			}
			manager.update(this.channelId, this.react, size, from, nextProps.stream);
		}
		if (nextProps.pagination !== this.pagination) {
			this.pagination = nextProps.pagination;
			this.setState({
				requestOnScroll: !nextProps.pagination
			});
		}
	};

	// check the height and set scroll if scroll not exists


	ReactiveList.prototype.componentDidUpdate = function componentDidUpdate() {
		if (!this.state.showPlaceholder && !this.props.scrollOnTarget) {
			this.applyScroll();
		}
	};

	// stop streaming request and remove listener when component will unmount


	ReactiveList.prototype.componentWillUnmount = function componentWillUnmount() {
		this.removeChannel();
	};

	ReactiveList.prototype.applyScroll = function applyScroll() {
		var _this2 = this;

		var resultElement = $(this.listParentElement);
		var scrollElement = $(this.listChildElement);
		var padding = 45;

		var getHeight = function getHeight(item) {
			return item.height() ? item.height() : 0;
		};

		var checkHeight = function checkHeight() {
			var flag = resultElement.get(0).scrollHeight - padding > resultElement.height();
			var scrollFlag = scrollElement.get(0).scrollHeight > scrollElement.height();
			if (!flag && !scrollFlag && scrollElement.length && !_this2.props.pagination) {
				var headerHeight = getHeight(resultElement.find(".rbc-title")) + getHeight(resultElement.find(".rbc-pagination")) * resultElement.find(".rbc-pagination").length;
				var finalHeight = resultElement.height() - 60 - headerHeight;
				if (finalHeight > 0) {
					scrollElement.css({
						height: scrollElement.height() + 15,
						"padding-bottom": 20
					});
				}
			}
		};

		if (resultElement && resultElement.length && scrollElement && scrollElement.length) {
			scrollElement.css({
				"height": "auto",
				"padding-bottom": 0
			});
			setTimeout(checkHeight.bind(this), 1000);
		}
	};

	ReactiveList.prototype.removeChannel = function removeChannel() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
			this.channelId = null;
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.loadListener) {
			this.loadListener.remove();
		}
	};

	ReactiveList.prototype.setReact = function setReact(props) {
		// Set the react - add self aggs query as well with react
		var react = Object.assign({}, props.react);

		var reactAnd = ["streamChanges"];
		if (props.pagination) {
			reactAnd.push("paginationChanges");
			react.pagination = null;
		}
		if (this.sortObj) {
			this.enableSort(reactAnd);
		}

		this.react = helper.setupReact(react, reactAnd);
	};

	// Create a channel which passes the react and receive results whenever react changes


	ReactiveList.prototype.createChannel = function createChannel() {
		var _this3 = this;

		var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, this.props.size, this.props.from, this.props.stream, this.props.componentId, this.context.appbaseCrdentials);
		this.channelId = channelObj.channelId;

		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
			// implementation to prevent initialize query issue if old query response is late then the newer query
			// then we will consider the response of new query and prevent to apply changes for old query response.
			// if queryStartTime of channel response is greater than the previous one only then apply changes
			if (res.error && res.startTime > _this3.queryStartTime) {
				_this3.setState({
					queryStart: false,
					showPlaceholder: false
				});
				if (_this3.props.onAllData) {
					var modifiedData = helper.prepareResultData(res);
					_this3.props.onAllData(modifiedData.res, modifiedData.err);
				}
			}
			if (res.appliedQuery) {
				if (res.mode === "historic" && res.startTime > _this3.queryStartTime) {
					var visibleNoResults = res.appliedQuery && Object.keys(res.appliedQuery).length && res.data && !res.data.error ? !(res.data.hits && res.data.hits.total) : false;
					var resultStats = {
						resultFound: !!(res.appliedQuery && res.data && !res.data.error && res.data.hits && res.data.hits.total)
					};
					if (res.appliedQuery && res.data && !res.data.error) {
						resultStats.total = res.data.hits.total;
						resultStats.took = res.data.took;
					}
					_this3.setState({
						queryStart: false,
						visibleNoResults: visibleNoResults,
						resultStats: resultStats,
						showPlaceholder: false
					});
					_this3.afterChannelResponse(res);
				} else if (res.mode === "streaming") {
					_this3.afterChannelResponse(res);
					_this3.updateResultStats(res.data);
				}
			} else {
				_this3.setState({
					showPlaceholder: true
				});
			}
		});
		this.listenLoadingChannel(channelObj);
		if (executeChannel) {
			setTimeout(function () {
				var obj = {
					key: "streamChanges",
					value: ""
				};
				helper.selectedSensor.set(obj, true);
			}, 100);
		}
	};

	ReactiveList.prototype.updateResultStats = function updateResultStats(newData) {
		var resultStats = this.state.resultStats;
		resultStats.total = helper.updateStats(resultStats.total, newData);
		this.setState({
			resultStats: resultStats
		});
	};

	ReactiveList.prototype.listenLoadingChannel = function listenLoadingChannel(channelObj) {
		var _this4 = this;

		this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
			if (res.appliedQuery) {
				var showInitialLoader = !(_this4.state.requestOnScroll && res.appliedQuery.body && res.appliedQuery.body.from);
				_this4.setState({
					queryStart: res.queryState,
					showInitialLoader: showInitialLoader
				});
			}
		});
	};

	ReactiveList.prototype.afterChannelResponse = function afterChannelResponse(res) {
		var _this5 = this;

		var data = res.data;
		var rawData = void 0,
		    markersData = void 0,
		    newData = [],
		    currentData = [];
		this.streamFlag = false;
		if (res.mode === "streaming") {
			this.channelMethod = "streaming";
			newData = data;
			newData.stream = true;
			currentData = this.state.currentData;
			this.streamFlag = true;
			markersData = this.setMarkersData(rawData);
		} else if (res.mode === "historic") {
			this.queryStartTime = res.startTime;
			this.channelMethod = "historic";
			newData = data.hits && data.hits.hits ? data.hits.hits : [];
			var normalizeCurrentData = this.normalizeCurrentData(res, this.state.currentData, newData);
			newData = normalizeCurrentData.newData;
			currentData = normalizeCurrentData.currentData;
		}
		this.setState({
			rawData: rawData,
			newData: newData,
			currentData: currentData,
			markersData: markersData,
			isLoading: false
		}, function () {
			// Pass the historic or streaming data in index method
			res.allMarkers = rawData;
			var modifiedData = JSON.parse(JSON.stringify(res));
			modifiedData.newData = _this5.state.newData;
			modifiedData.currentData = _this5.state.currentData;
			delete modifiedData.data;
			modifiedData = helper.prepareResultData(modifiedData, data);
			var generatedData = _this5.props.onAllData ? _this5.props.onAllData(modifiedData.res, modifiedData.err) : _this5.defaultonAllData(modifiedData.res, modifiedData.err);
			_this5.setState({
				resultMarkup: generatedData,
				currentData: _this5.combineCurrentData(newData)
			});
		});
	};

	// normalize current data


	ReactiveList.prototype.normalizeCurrentData = function normalizeCurrentData(res, rawData, newData) {
		var appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
		if (this.state.requestOnScroll && appliedQuery && appliedQuery.body) {
			delete appliedQuery.body.from;
			delete appliedQuery.body.size;
		}
		var isSameQuery = JSON.stringify(appliedQuery) === JSON.stringify(this.appliedQuery);
		var currentData = isSameQuery ? rawData || [] : [];
		if (!currentData.length) {
			this.appliedQuery = appliedQuery;
		} else {
			newData = newData.filter(function (newRecord) {
				var notExits = true;
				currentData.forEach(function (oldRecord) {
					if (newRecord._id + "-" + newRecord._type === oldRecord._id + "-" + oldRecord._type) {
						notExits = false;
					}
				});
				return notExits;
			});
		}
		if (!isSameQuery) {
			$(".rbc.rbc-reactivelist").animate({
				scrollTop: 0
			}, 100);
		}
		return {
			currentData: currentData,
			newData: newData
		};
	};

	ReactiveList.prototype.combineCurrentData = function combineCurrentData(newData) {
		if (Array.isArray(newData)) {
			newData = newData.map(function (item) {
				item.stream = false;
				return item;
			});
			return this.state.currentData.concat(newData);
		}
		return this.streamDataModify(this.state.currentData, newData, false);
	};

	// enable sort


	ReactiveList.prototype.enableSort = function enableSort(reactAnd) {
		reactAnd.push(this.resultSortKey);
		var sortObj = {
			key: this.resultSortKey,
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(sortObj);
	};

	// append data if pagination is applied


	ReactiveList.prototype.appendData = function appendData(data) {
		var rawData = this.state.rawData;
		var hits = rawData.hits.hits.concat(data.hits.hits);
		rawData.hits.hits = _uniqBy(hits, "_id");
		return rawData;
	};

	// append stream boolean flag and also start time of stream


	ReactiveList.prototype.streamDataModify = function streamDataModify(rawData, data) {
		var streamFlag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

		if (data) {
			data.stream = streamFlag;
			data.streamStart = new Date();
			if (data._deleted) {
				var hits = rawData.filter(function (hit) {
					return hit._id !== data._id;
				});
				rawData = hits;
			} else {
				var _hits = rawData.filter(function (hit) {
					return hit._id !== data._id;
				});
				rawData = _hits;
				rawData.unshift(data);
			}
		}
		return rawData;
	};

	// tranform the raw data to marker data


	ReactiveList.prototype.setMarkersData = function setMarkersData(hits) {
		if (hits) {
			return hits;
		}
		return [];
	};

	ReactiveList.prototype.initialize = function initialize() {
		var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		this.setReact(this.props);
		this.createChannel(executeChannel);
		if (this.state.requestOnScroll) {
			this.listComponent();
		} else {
			this.setQueryForPagination();
		}
	};

	ReactiveList.prototype.setQueryForPagination = function setQueryForPagination() {
		var valObj = {
			queryType: "match",
			inputData: this.props.appbaseField,
			customQuery: function customQuery() {
				return null;
			}
		};
		var obj = {
			key: "paginationChanges",
			value: valObj
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	ReactiveList.prototype.executePaginationUpdate = function executePaginationUpdate() {
		setTimeout(function () {
			var obj = {
				key: "paginationChanges",
				value: Math.random()
			};
			helper.selectedSensor.set(obj, true);
		}, 100);
	};

	ReactiveList.prototype.paginationAt = function paginationAt(method) {
		var pageinationComp = void 0;
		if (this.props.pagination && (this.props.paginationAt === method || this.props.paginationAt === "both")) {
			pageinationComp = React.createElement(
				"div",
				{ className: "rbc-pagination-container col s12 col-xs-12" },
				React.createElement(Pagination, {
					className: "rbc-pagination-" + method,
					componentId: "pagination",
					onPageChange: this.props.onPageChange,
					title: this.props.paginationTitle,
					pages: this.props.pages
				})
			);
		}
		return pageinationComp;
	};

	ReactiveList.prototype.defaultonAllData = function defaultonAllData(res) {
		var _this6 = this;

		var result = null;
		if (res) {
			var combineData = res.currentData;
			if (res.mode === "historic") {
				combineData = res.currentData.concat(res.newData);
			} else if (res.mode === "streaming") {
				combineData = helper.combineStreamData(res.currentData, res.newData);
			}
			if (combineData) {
				result = combineData.map(function (markerData) {
					var marker = markerData._source;
					return _this6.props.onData ? _this6.props.onData(markerData) : React.createElement(
						"div",
						{ className: "row", style: { marginTop: "20px" } },
						_this6.itemMarkup(marker, markerData)
					);
				});
			}
		}
		return result;
	};

	ReactiveList.prototype.itemMarkup = function itemMarkup(marker, markerData) {
		return React.createElement(
			"div",
			{
				key: markerData._id,
				style: { padding: "12px", fontSize: "12px" },
				className: "makerInfo"
			},
			React.createElement(JsonPrint, { data: marker })
		);
	};

	ReactiveList.prototype.nextPage = function nextPage() {
		function start() {
			this.setState({
				isLoading: true
			});
			manager.nextPage(this.channelId);
		}

		if (this.state.resultStats.total > this.state.currentData.length && !this.state.queryStart) {
			start.call(this);
		}
	};

	ReactiveList.prototype.listComponent = function listComponent() {
		function setScroll(node) {
			var _this7 = this;

			if (node) {
				node.addEventListener("scroll", function () {
					var scrollHeight = node.scrollHeight || node.scrollHeight === 0 ? node.scrollHeight : $(node).height();
					if (_this7.state.requestOnScroll && $(node).scrollTop() + $(node).innerHeight() >= scrollHeight && _this7.state.resultStats.total > _this7.state.currentData.length && !_this7.state.queryStart) {
						_this7.nextPage();
					}
				});
			}
		}
		if (this.props.scrollOnTarget) {
			setScroll.call(this, this.props.scrollOnTarget);
		} else {
			setScroll.call(this, this.listParentElement);
			setScroll.call(this, this.listChildElement);
		}
	};

	ReactiveList.prototype.handleSortSelect = function handleSortSelect(event) {
		var _sortObj;

		var index = event.target.value;
		this.sortObj = (_sortObj = {}, _sortObj[this.props.sortOptions[index].appbaseField] = {
			order: this.props.sortOptions[index].sortBy
		}, _sortObj);
		var obj = {
			key: this.resultSortKey,
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, "sortChange");
	};

	ReactiveList.prototype.getComponentStyle = function getComponentStyle() {
		var componentStyle = {};
		if (this.props.scrollOnTarget) {
			componentStyle.maxHeight = "none";
			componentStyle.height = "auto";
		}
		componentStyle = Object.assign(componentStyle, this.props.componentStyle);
		return componentStyle;
	};

	ReactiveList.prototype.render = function render() {
		var _this8 = this;

		var title = null,
		    placeholder = null,
		    sortOptions = null;
		var cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-sort-active": this.props.sortOptions,
			"rbc-sort-inactive": !this.props.sortOptions,
			"rbc-stream-active": this.props.stream,
			"rbc-stream-inactive": !this.props.stream,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader,
			"rbc-resultstats-active": this.props.showResultStats,
			"rbc-resultstats-inactive": !this.props.showResultStats,
			"rbc-noresults-active": this.props.noResults,
			"rbc-noresults-inactive": !this.props.noResults,
			"rbc-pagination-active": this.props.pagination,
			"rbc-pagination-inactive": !this.props.pagination
		});

		if (this.props.title) {
			title = React.createElement(
				"h4",
				{ className: "rbc-title col s12 col-xs-12" },
				this.props.title
			);
		}
		if (this.props.placeholder) {
			placeholder = React.createElement(
				"div",
				{ className: "rbc-placeholder col s12 col-xs-12" },
				this.props.placeholder
			);
		}

		if (this.props.sortOptions) {
			var options = this.props.sortOptions.map(function (item, index) {
				return React.createElement(
					"option",
					{ value: index, key: item.label },
					item.label
				);
			});

			sortOptions = React.createElement(
				"div",
				{ className: "rbc-sortoptions input-field col" },
				React.createElement(
					"select",
					{ className: "browser-default form-control", onChange: this.handleSortSelect },
					options
				)
			);
		}

		return React.createElement(
			"div",
			{ className: "rbc-reactivelist-container" },
			React.createElement(
				"div",
				{ ref: function ref(div) {
						_this8.listParentElement = div;
					}, className: "rbc rbc-reactivelist card thumbnail " + cx, style: this.getComponentStyle() },
				title,
				sortOptions,
				this.props.showResultStats && this.state.resultStats.resultFound ? React.createElement(ResultStats, { onResultStats: this.props.onResultStats, took: this.state.resultStats.took, total: this.state.resultStats.total }) : null,
				this.paginationAt("top"),
				React.createElement(
					"div",
					{ ref: function ref(div) {
							_this8.listChildElement = div;
						}, className: "rbc-reactivelist-scroll-container col s12 col-xs-12" },
					this.state.resultMarkup
				),
				this.state.isLoading ? React.createElement("div", { className: "rbc-loader" }) : null,
				this.state.showPlaceholder ? placeholder : null,
				this.paginationAt("bottom")
			),
			this.props.noResults && this.state.visibleNoResults ? React.createElement(NoResults, { defaultText: this.props.noResults }) : null,
			this.props.initialLoader && this.state.queryStart && this.state.showInitialLoader ? React.createElement(InitialLoader, { defaultText: this.props.initialLoader }) : null,
			React.createElement(PoweredBy, { container: "rbc-reactivelist-container" })
		);
	};

	return ReactiveList;
}(Component);

export default ReactiveList;


ReactiveList.propTypes = {
	componentId: React.PropTypes.string,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	sortBy: React.PropTypes.oneOf(["asc", "desc", "default"]),
	sortOptions: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.string,
		appbaseField: React.PropTypes.string,
		sortBy: React.PropTypes.string
	})),
	from: helper.validation.resultListFrom,
	onAllData: React.PropTypes.func,
	size: helper.sizeValidation,
	stream: React.PropTypes.bool,
	componentStyle: React.PropTypes.object,
	initialLoader: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	noResults: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	showResultStats: React.PropTypes.bool,
	onResultStats: React.PropTypes.func,
	placeholder: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	react: React.PropTypes.object,
	paginationAt: React.PropTypes.string,
	pagination: React.PropTypes.bool,
	pages: React.PropTypes.number,
	scrollOnTarget: React.PropTypes.object
};

ReactiveList.defaultProps = {
	from: 0,
	size: 20,
	stream: false,
	componentStyle: {},
	showResultStats: true,
	pagination: false,
	paginationAt: "bottom",
	pages: 5
};

// context type
ReactiveList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	app: React.PropTypes.any.isRequired,
	appbaseCrdentials: React.PropTypes.any.isRequired
};

ReactiveList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	sortBy: TYPES.STRING,
	sortOptions: TYPES.OBJECT,
	from: TYPES.NUMBER,
	onAllData: TYPES.FUNCTION,
	onData: TYPES.FUNCTION,
	size: TYPES.NUMBER,
	stream: TYPES.BOOLEAN,
	componentStyle: TYPES.OBJECT,
	initialLoader: TYPES.STRING,
	noResults: TYPES.FUNCTION,
	showResultStats: TYPES.BOOLEAN,
	onResultStats: TYPES.FUNCTION,
	placeholder: TYPES.STRING,
	pagination: TYPES.BOOLEAN,
	paginationAt: TYPES.STRING,
	pages: TYPES.NUMBER,
	scrollOnTarget: TYPES.OBJECT
};