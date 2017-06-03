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

var _PoweredBy = require("../sensors/PoweredBy");

var _PoweredBy2 = _interopRequireDefault(_PoweredBy);

var _InitialLoader = require("../addons/InitialLoader");

var _InitialLoader2 = _interopRequireDefault(_InitialLoader);

var _NoResults = require("../addons/NoResults");

var _NoResults2 = _interopRequireDefault(_NoResults);

var _ResultStats = require("../addons/ResultStats");

var _ResultStats2 = _interopRequireDefault(_ResultStats);

var _constants = require("../middleware/constants");

var TYPES = _interopRequireWildcard(_constants);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require("../middleware/helper");

var ReactiveElement = function (_Component) {
	_inherits(ReactiveElement, _Component);

	function ReactiveElement(props) {
		_classCallCheck(this, ReactiveElement);

		var _this = _possibleConstructorReturn(this, (ReactiveElement.__proto__ || Object.getPrototypeOf(ReactiveElement)).call(this, props));

		_this.state = {
			markers: [],
			query: {},
			rawData: [],
			resultMarkup: [],
			isLoading: false,
			queryStart: false,
			resultStats: {
				resultFound: false,
				total: 0,
				took: 0
			},
			showPlaceholder: true
		};
		_this.channelId = null;
		_this.channelListener = null;
		_this.queryStartTime = 0;
		_this.appliedQuery = {};
		return _this;
	}

	// tranform the raw data to marker data


	_createClass(ReactiveElement, [{
		key: "setMarkersData",
		value: function setMarkersData(hits) {
			if (hits) {
				return hits;
			}
			return [];
		}

		// append stream boolean flag and also start time of stream

	}, {
		key: "streamDataModify",
		value: function streamDataModify(rawData, data) {
			if (data) {
				data.stream = true;
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

		// default markup

	}, {
		key: "defaultonAllData",
		value: function defaultonAllData(res) {
			var result = null;
			if (res && res.appliedQuery) {
				result = _react2.default.createElement(
					"div",
					{ className: "row", style: { marginTop: "60px" } },
					_react2.default.createElement(
						"pre",
						{ className: "pull-left" },
						JSON.stringify(res.newData, null, 4)
					)
				);
			}
			return result;
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			this.streamProp = this.props.stream;
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
					_this2.removeChannel();
					_this2.initialize(true);
				}
			}, 300);
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			this.removeChannel();
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this3 = this;

			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			var reactAnd = ["streamChanges"];
			react = helper.setupReact(react, reactAnd);

			// create a channel and listen the changes
			var channelObj = _ChannelManager2.default.create(this.context.appbaseRef, this.context.type, react, this.props.size, this.props.from, this.props.stream, this.context.app);
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
						var visibleNoResults = res.appliedQuery && res.data && !res.data.error ? !(res.data.hits && res.data.hits.total) : false;
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
				var obj = {
					key: "streamChanges",
					value: ""
				};
				helper.selectedSensor.set(obj, true);
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
		key: "afterChannelResponse",
		value: function afterChannelResponse(res) {
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
				modifiedData = helper.prepareResultData(modifiedData, res.data);
				var generatedData = _this5.props.onAllData ? _this5.props.onAllData(modifiedData.res, modifiedData.err) : _this5.defaultonAllData(modifiedData.res, modifiedData.err);
				_this5.setState({
					resultMarkup: generatedData,
					currentData: _this5.combineCurrentData(newData)
				});
			});
		}

		// normalize current data

	}, {
		key: "normalizeCurrentData",
		value: function normalizeCurrentData(res, rawData, newData) {
			var appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
			var currentData = JSON.stringify(appliedQuery) === JSON.stringify(this.appliedQuery) ? rawData || [] : [];
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
			return {
				currentData: currentData,
				newData: newData
			};
		}
	}, {
		key: "combineCurrentData",
		value: function combineCurrentData(newData) {
			if (_lodash2.default.isArray(newData)) {
				return this.state.currentData.concat(newData);
			}
			return this.streamDataModify(this.state.currentData, newData);
		}
	}, {
		key: "initialize",
		value: function initialize() {
			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			this.createChannel(executeChannel);
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
	}, {
		key: "render",
		value: function render() {
			var title = null,
			    placeholder = null;
			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-placeholder-active": this.props.placeholder,
				"rbc-placeholder-inactive": !this.props.placeholder,
				"rbc-stream-active": this.props.stream,
				"rbc-stream-inactive": !this.props.stream,
				"rbc-initialloader-active": this.props.initialLoader,
				"rbc-initialloader-inactive": !this.props.initialLoader,
				"rbc-resultstats-active": this.props.showResultStats,
				"rbc-resultstats-inactive": !this.props.showResultStats,
				"rbc-noresults-active": this.props.noResults,
				"rbc-noresults-inactive": !this.props.noResults
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

			return _react2.default.createElement(
				"div",
				{ className: "rbc-reactiveelement-container" },
				_react2.default.createElement(
					"div",
					{ className: "rbc rbc-reactiveelement card thumbnail " + cx, style: this.props.componentStyle },
					title,
					this.state.resultStats && this.state.resultStats.resultFound && this.props.showResultStats ? _react2.default.createElement(_ResultStats2.default, { onResultStats: this.props.onResultStats, took: this.state.resultStats.took, total: this.state.resultStats.total }) : null,
					this.state.resultMarkup,
					this.state.showPlaceholder ? placeholder : null
				),
				this.props.noResults && this.state.visibleNoResults ? _react2.default.createElement(_NoResults2.default, { defaultText: this.props.noResults.text }) : null,
				this.props.initialLoader && this.state.queryStart ? _react2.default.createElement(_InitialLoader2.default, { defaultText: this.props.initialLoader.text }) : null,
				_react2.default.createElement(_PoweredBy2.default, { container: "rbc-reactiveelement-container" })
			);
		}
	}]);

	return ReactiveElement;
}(_react.Component);

exports.default = ReactiveElement;


ReactiveElement.propTypes = {
	componentId: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	from: helper.validation.resultListFrom,
	onAllData: _react2.default.PropTypes.func,
	size: helper.sizeValidation,
	stream: _react2.default.PropTypes.bool,
	componentStyle: _react2.default.PropTypes.object,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	noResults: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	showResultStats: _react2.default.PropTypes.bool,
	onResultStats: _react2.default.PropTypes.func,
	react: _react2.default.PropTypes.object,
	placeholder: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element])
};

ReactiveElement.defaultProps = {
	from: 0,
	size: 20,
	stream: false,
	showResultStats: true,
	componentStyle: {}
};

// context type
ReactiveElement.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired,
	app: _react2.default.PropTypes.any.isRequired
};

ReactiveElement.types = {
	componentId: TYPES.STRING,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	from: TYPES.NUMBER,
	size: TYPES.NUMBER,
	onAllData: TYPES.FUNCTION,
	stream: TYPES.BOOLEAN,
	componentStyle: TYPES.OBJECT,
	initialLoader: TYPES.STRING,
	noResults: TYPES.STRING,
	showResultStats: TYPES.BOOLEAN,
	onResultStats: TYPES.FUNCTION,
	placeholder: TYPES.STRING
};