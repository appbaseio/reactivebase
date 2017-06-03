"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require("../middleware/ChannelManager");

var _ChannelManager2 = _interopRequireDefault(_ChannelManager);

var _JsonPrint = require("../addons/JsonPrint");

var _JsonPrint2 = _interopRequireDefault(_JsonPrint);

var _PoweredBy = require("../sensors/PoweredBy");

var _PoweredBy2 = _interopRequireDefault(_PoweredBy);

var _InitialLoader = require("../addons/InitialLoader");

var _InitialLoader2 = _interopRequireDefault(_InitialLoader);

var _NoResults = require("../addons/NoResults");

var _NoResults2 = _interopRequireDefault(_NoResults);

var _ResultStats = require("../addons/ResultStats");

var _ResultStats2 = _interopRequireDefault(_ResultStats);

var _Pagination = require("../addons/Pagination");

var _Pagination2 = _interopRequireDefault(_Pagination);

var _constants = require("../middleware/constants");

var TYPES = _interopRequireWildcard(_constants);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var helper = require("../middleware/helper");
var $ = require("jquery");

var ReactiveList = function (_Component) {
	_inherits(ReactiveList, _Component);

	function ReactiveList(props) {
		_classCallCheck(this, ReactiveList);

		var _this = _possibleConstructorReturn(this, (ReactiveList.__proto__ || Object.getPrototypeOf(ReactiveList)).call(this, props));

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
			var obj = _this.props.sortOptions[0];
			_this.sortObj = _defineProperty({}, obj.appbaseField, {
				order: obj.sortBy
			});
		} else if (_this.props.sortBy) {
			_this.sortObj = _defineProperty({}, _this.props.appbaseField, {
				order: _this.props.sortBy
			});
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

	_createClass(ReactiveList, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			this.streamProp = this.props.stream;
			this.size = this.props.size;
			this.initialize();
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			var _this2 = this;

			setTimeout(function () {
				if (_this2.streamProp !== _this2.props.stream) {
					_this2.streamProp = _this2.props.stream;
					_this2.removeChannel();
					_this2.initialize(true);
				}
				if (_this2.size !== _this2.props.size) {
					_this2.size = _this2.props.size;
					_this2.setState({
						currentData: []
					});
					_this2.removeChannel();
					_this2.initialize(true);
				}
				if (_this2.props.pagination && _this2.paginationAtVal !== _this2.props.paginationAt) {
					_this2.paginationAtVal = _this2.props.paginationAt;
					_this2.executePaginationUpdate();
				}
			}, 300);
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var _this3 = this;

			if (nextProps.pagination !== this.pagination) {
				this.pagination = nextProps.pagination;
				this.setState({
					requestOnScroll: !nextProps.pagination
				}, function () {
					_this3.removeChannel();
					_this3.initialize(true);
				});
			}
		}

		// check the height and set scroll if scroll not exists

	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			if (!this.state.showPlaceholder && !this.props.scrollOnTarget) {
				this.applyScroll();
			}
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			this.removeChannel();
		}
	}, {
		key: "applyScroll",
		value: function applyScroll() {
			var _this4 = this;

			var resultElement = $(this.listParentElement);
			var scrollElement = $(this.listChildElement);
			var padding = 45;

			var getHeight = function getHeight(item) {
				return item.height() ? item.height() : 0;
			};

			var checkHeight = function checkHeight() {
				var flag = resultElement.get(0).scrollHeight - padding > resultElement.height();
				var scrollFlag = scrollElement.get(0).scrollHeight > scrollElement.height();
				if (!flag && !scrollFlag && scrollElement.length && !_this4.props.pagination) {
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
		}
	}, {
		key: "removeChannel",
		value: function removeChannel() {
			if (this.channelId) {
				_ChannelManager2.default.stopStream(this.channelId);
				this.channelId = null;
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.loadListener) {
				this.loadListener.remove();
			}
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this5 = this;

			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			var reactAnd = ["streamChanges"];
			if (this.props.pagination) {
				reactAnd.push("paginationChanges");
				react.pagination = null;
			}
			if (this.sortObj) {
				this.enableSort(reactAnd);
			}
			react = helper.setupReact(react, reactAnd);
			// create a channel and listen the changes
			var channelObj = _ChannelManager2.default.create(this.context.appbaseRef, this.context.type, react, this.props.size, this.props.from, this.props.stream, this.context.app, this.context.appbaseCrdentials);
			this.channelId = channelObj.channelId;

			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				// implementation to prevent initialize query issue if old query response is late then the newer query
				// then we will consider the response of new query and prevent to apply changes for old query response.
				// if queryStartTime of channel response is greater than the previous one only then apply changes
				if (res.error && res.startTime > _this5.queryStartTime) {
					_this5.setState({
						queryStart: false,
						showPlaceholder: false
					});
					if (_this5.props.onAllData) {
						var modifiedData = helper.prepareResultData(res);
						_this5.props.onAllData(modifiedData.res, modifiedData.err);
					}
				}
				if (res.appliedQuery) {
					if (res.mode === "historic" && res.startTime > _this5.queryStartTime) {
						var visibleNoResults = res.appliedQuery && Object.keys(res.appliedQuery).length && res.data && !res.data.error ? !(res.data.hits && res.data.hits.total) : false;
						var resultStats = {
							resultFound: !!(res.appliedQuery && res.data && !res.data.error && res.data.hits && res.data.hits.total)
						};
						if (res.appliedQuery && res.data && !res.data.error) {
							resultStats.total = res.data.hits.total;
							resultStats.took = res.data.took;
						}
						_this5.setState({
							queryStart: false,
							visibleNoResults: visibleNoResults,
							resultStats: resultStats,
							showPlaceholder: false
						});
						_this5.afterChannelResponse(res);
					} else if (res.mode === "streaming") {
						_this5.afterChannelResponse(res);
						_this5.updateResultStats(res.data);
					}
				} else {
					_this5.setState({
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
		}
	}, {
		key: "updateResultStats",
		value: function updateResultStats(newData) {
			var resultStats = this.state.resultStats;
			resultStats.total = helper.updateStats(resultStats.total, newData);
			this.setState({
				resultStats: resultStats
			});
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj) {
			var _this6 = this;

			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					var showInitialLoader = !(_this6.state.requestOnScroll && res.appliedQuery.body && res.appliedQuery.body.from);
					_this6.setState({
						queryStart: res.queryState,
						showInitialLoader: showInitialLoader
					});
				}
			});
		}
	}, {
		key: "afterChannelResponse",
		value: function afterChannelResponse(res) {
			var _this7 = this;

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
				modifiedData.newData = _this7.state.newData;
				modifiedData.currentData = _this7.state.currentData;
				delete modifiedData.data;
				modifiedData = helper.prepareResultData(modifiedData, data);
				var generatedData = _this7.props.onAllData ? _this7.props.onAllData(modifiedData.res, modifiedData.err) : _this7.defaultonAllData(modifiedData.res, modifiedData.err);
				_this7.setState({
					resultMarkup: _this7.wrapMarkup(generatedData),
					currentData: _this7.combineCurrentData(newData)
				});
			});
		}
	}, {
		key: "wrapMarkup",
		value: function wrapMarkup(generatedData) {
			var markup = null;
			if (_lodash2.default.isArray(generatedData)) {
				markup = generatedData.map(function (item, index) {
					return _react2.default.createElement(
						"div",
						{ key: index, className: "rbc-list-item" },
						item
					);
				});
			} else {
				markup = generatedData;
			}
			return markup;
		}

		// normalize current data

	}, {
		key: "normalizeCurrentData",
		value: function normalizeCurrentData(res, rawData, newData) {
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
		}
	}, {
		key: "combineCurrentData",
		value: function combineCurrentData(newData) {
			if (_lodash2.default.isArray(newData)) {
				newData = newData.map(function (item) {
					item.stream = false;
					return item;
				});
				return this.state.currentData.concat(newData);
			}
			return this.streamDataModify(this.state.currentData, newData, false);
		}

		// enable sort

	}, {
		key: "enableSort",
		value: function enableSort(reactAnd) {
			reactAnd.push(this.resultSortKey);
			var sortObj = {
				key: this.resultSortKey,
				value: this.sortObj
			};
			helper.selectedSensor.setSortInfo(sortObj);
		}

		// append data if pagination is applied

	}, {
		key: "appendData",
		value: function appendData(data) {
			var rawData = this.state.rawData;
			var hits = rawData.hits.hits.concat(data.hits.hits);
			rawData.hits.hits = _lodash2.default.uniqBy(hits, "_id");
			return rawData;
		}

		// append stream boolean flag and also start time of stream

	}, {
		key: "streamDataModify",
		value: function streamDataModify(rawData, data) {
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
		}

		// tranform the raw data to marker data

	}, {
		key: "setMarkersData",
		value: function setMarkersData(hits) {
			if (hits) {
				return hits;
			}
			return [];
		}
	}, {
		key: "initialize",
		value: function initialize() {
			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			this.createChannel(executeChannel);
			if (this.state.requestOnScroll) {
				this.listComponent();
			} else {
				this.setQueryForPagination();
			}
		}
	}, {
		key: "setQueryForPagination",
		value: function setQueryForPagination() {
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
		}
	}, {
		key: "executePaginationUpdate",
		value: function executePaginationUpdate() {
			setTimeout(function () {
				var obj = {
					key: "paginationChanges",
					value: Math.random()
				};
				helper.selectedSensor.set(obj, true);
			}, 100);
		}
	}, {
		key: "paginationAt",
		value: function paginationAt(method) {
			var pageinationComp = void 0;
			if (this.props.pagination && (this.props.paginationAt === method || this.props.paginationAt === "both")) {
				pageinationComp = _react2.default.createElement(
					"div",
					{ className: "rbc-pagination-container col s12 col-xs-12" },
					_react2.default.createElement(_Pagination2.default, {
						className: "rbc-pagination-" + method,
						componentId: "pagination",
						onPageChange: this.props.onPageChange,
						title: this.props.paginationTitle,
						pages: this.props.pages
					})
				);
			}
			return pageinationComp;
		}
	}, {
		key: "defaultonAllData",
		value: function defaultonAllData(res) {
			var _this8 = this;

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
						return _this8.props.onData ? _this8.props.onData(markerData) : _react2.default.createElement(
							"div",
							{ className: "row", style: { marginTop: "20px" } },
							_this8.itemMarkup(marker, markerData)
						);
					});
				}
			}
			return result;
		}
	}, {
		key: "itemMarkup",
		value: function itemMarkup(marker, markerData) {
			return _react2.default.createElement(
				"div",
				{
					key: markerData._id,
					style: { padding: "12px", fontSize: "12px" },
					className: "makerInfo"
				},
				_react2.default.createElement(_JsonPrint2.default, { data: marker })
			);
		}
	}, {
		key: "nextPage",
		value: function nextPage() {
			function start() {
				this.setState({
					isLoading: true
				});
				_ChannelManager2.default.nextPage(this.channelId);
			}

			if (this.state.resultStats.total > this.state.currentData.length && !this.state.queryStart) {
				start.call(this);
			}
		}
	}, {
		key: "listComponent",
		value: function listComponent() {
			function setScroll(node) {
				var _this9 = this;

				if (node) {
					node.addEventListener("scroll", function () {
						var scrollHeight = node.scrollHeight || node.scrollHeight === 0 ? node.scrollHeight : $(node).height();
						if (_this9.state.requestOnScroll && $(node).scrollTop() + $(node).innerHeight() >= scrollHeight && _this9.state.resultStats.total > _this9.state.currentData.length && !_this9.state.queryStart) {
							_this9.nextPage();
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
		}
	}, {
		key: "handleSortSelect",
		value: function handleSortSelect(event) {
			var index = event.target.value;
			this.sortObj = _defineProperty({}, this.props.sortOptions[index].appbaseField, {
				order: this.props.sortOptions[index].sortBy
			});
			var obj = {
				key: this.resultSortKey,
				value: this.sortObj
			};
			helper.selectedSensor.set(obj, true, "sortChange");
		}
	}, {
		key: "getComponentStyle",
		value: function getComponentStyle() {
			var componentStyle = {};
			if (this.props.scrollOnTarget) {
				componentStyle.maxHeight = "none";
				componentStyle.height = "auto";
			}
			componentStyle = Object.assign(componentStyle, this.props.componentStyle);
			return componentStyle;
		}
	}, {
		key: "render",
		value: function render() {
			var _this10 = this;

			var title = null,
			    placeholder = null,
			    sortOptions = null;
			var cx = (0, _classnames2.default)({
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
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}
			if (this.props.placeholder) {
				placeholder = _react2.default.createElement(
					"div",
					{ className: "rbc-placeholder col s12 col-xs-12" },
					this.props.placeholder
				);
			}

			if (this.props.sortOptions) {
				var options = this.props.sortOptions.map(function (item, index) {
					return _react2.default.createElement(
						"option",
						{ value: index, key: item.label },
						item.label
					);
				});

				sortOptions = _react2.default.createElement(
					"div",
					{ className: "rbc-sortoptions input-field col" },
					_react2.default.createElement(
						"select",
						{ className: "browser-default form-control", onChange: this.handleSortSelect },
						options
					)
				);
			}

			return _react2.default.createElement(
				"div",
				{ className: "rbc-reactivelist-container" },
				_react2.default.createElement(
					"div",
					{ ref: function ref(div) {
							_this10.listParentElement = div;
						}, className: "rbc rbc-reactivelist card thumbnail " + cx, style: this.getComponentStyle() },
					title,
					sortOptions,
					this.props.showResultStats && this.state.resultStats.resultFound ? _react2.default.createElement(_ResultStats2.default, { onResultStats: this.props.onResultStats, took: this.state.resultStats.took, total: this.state.resultStats.total }) : null,
					this.paginationAt("top"),
					_react2.default.createElement(
						"div",
						{ ref: function ref(div) {
								_this10.listChildElement = div;
							}, className: "rbc-reactivelist-scroll-container col s12 col-xs-12" },
						this.state.resultMarkup
					),
					this.state.isLoading ? _react2.default.createElement("div", { className: "rbc-loader" }) : null,
					this.state.showPlaceholder ? placeholder : null,
					this.paginationAt("bottom")
				),
				this.props.noResults && this.state.visibleNoResults ? _react2.default.createElement(_NoResults2.default, { defaultText: this.props.noResults }) : null,
				this.props.initialLoader && this.state.queryStart && this.state.showInitialLoader ? _react2.default.createElement(_InitialLoader2.default, { defaultText: this.props.initialLoader }) : null,
				_react2.default.createElement(_PoweredBy2.default, { container: "rbc-reactivelist-container" })
			);
		}
	}]);

	return ReactiveList;
}(_react.Component);

exports.default = ReactiveList;


ReactiveList.propTypes = {
	componentId: _react2.default.PropTypes.string,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	sortBy: _react2.default.PropTypes.oneOf(["asc", "desc", "default"]),
	sortOptions: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		label: _react2.default.PropTypes.string,
		appbaseField: _react2.default.PropTypes.string,
		sortBy: _react2.default.PropTypes.string
	})),
	from: helper.validation.resultListFrom,
	onAllData: _react2.default.PropTypes.func,
	size: helper.sizeValidation,
	stream: _react2.default.PropTypes.bool,
	componentStyle: _react2.default.PropTypes.object,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	noResults: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	showResultStats: _react2.default.PropTypes.bool,
	onResultStats: _react2.default.PropTypes.func,
	placeholder: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	react: _react2.default.PropTypes.object,
	paginationAt: _react2.default.PropTypes.string,
	pagination: _react2.default.PropTypes.bool,
	pages: _react2.default.PropTypes.number,
	scrollOnTarget: _react2.default.PropTypes.object
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
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired,
	app: _react2.default.PropTypes.any.isRequired,
	appbaseCrdentials: _react2.default.PropTypes.any.isRequired
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