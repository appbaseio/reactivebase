function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import PoweredBy from "../sensors/PoweredBy";
import InitialLoader from "../addons/InitialLoader";
import NoResults from "../addons/NoResults";
import ResultStats from "../addons/ResultStats";
import * as TYPES from "../middleware/constants";

var helper = require("../middleware/helper");

var ReactiveElement = function (_Component) {
	_inherits(ReactiveElement, _Component);

	function ReactiveElement(props) {
		_classCallCheck(this, ReactiveElement);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

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

	ReactiveElement.prototype.componentWillMount = function componentWillMount() {
		this.setReact(this.props);
		this.streamProp = this.props.stream;
		this.initialize();
	};

	ReactiveElement.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (!_.isEqual(this.props.react, nextProps.react)) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, nextProps.size, nextProps.from, nextProps.size, nextProps.stream);
		}
	};

	ReactiveElement.prototype.componentWillUpdate = function componentWillUpdate() {
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
	};

	// stop streaming request and remove listener when component will unmount


	ReactiveElement.prototype.componentWillUnmount = function componentWillUnmount() {
		this.removeChannel();
	};

	// tranform the raw data to marker data


	ReactiveElement.prototype.setMarkersData = function setMarkersData(hits) {
		if (hits) {
			return hits;
		}
		return [];
	};

	// append stream boolean flag and also start time of stream


	ReactiveElement.prototype.streamDataModify = function streamDataModify(rawData, data) {
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
	};

	// default markup


	ReactiveElement.prototype.defaultonAllData = function defaultonAllData(res) {
		var result = null;
		if (res && res.appliedQuery) {
			result = React.createElement(
				"div",
				{ className: "row", style: { marginTop: "60px" } },
				React.createElement(
					"pre",
					{ className: "pull-left" },
					JSON.stringify(res.newData, null, 4)
				)
			);
		}
		return result;
	};

	ReactiveElement.prototype.setReact = function setReact(props) {
		// Set the react - add self aggs query as well with react
		var react = Object.assign({}, props.react);
		var reactAnd = ["streamChanges"];
		this.react = helper.setupReact(react, reactAnd);
	};

	// Create a channel which passes the react and receive results whenever react changes


	ReactiveElement.prototype.createChannel = function createChannel() {
		var _this3 = this;

		var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, this.props.size, this.props.from, this.props.stream, this.props.componentId);
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
	};

	ReactiveElement.prototype.updateResultStats = function updateResultStats(newData) {
		var resultStats = this.state.resultStats;
		resultStats.total = helper.updateStats(resultStats.total, newData);
		this.setState({
			resultStats: resultStats
		});
	};

	ReactiveElement.prototype.listenLoadingChannel = function listenLoadingChannel(channelObj) {
		var _this4 = this;

		this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
			if (res.appliedQuery) {
				_this4.setState({
					queryStart: res.queryState
				});
			}
		});
	};

	ReactiveElement.prototype.afterChannelResponse = function afterChannelResponse(res) {
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
	};

	// normalize current data


	ReactiveElement.prototype.normalizeCurrentData = function normalizeCurrentData(res, rawData, newData) {
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
	};

	ReactiveElement.prototype.combineCurrentData = function combineCurrentData(newData) {
		if (Array.isArray(newData)) {
			return this.state.currentData.concat(newData);
		}
		return this.streamDataModify(this.state.currentData, newData);
	};

	ReactiveElement.prototype.initialize = function initialize() {
		var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		this.createChannel(executeChannel);
	};

	ReactiveElement.prototype.removeChannel = function removeChannel() {
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

	ReactiveElement.prototype.render = function render() {
		var title = null,
		    placeholder = null;
		var cx = classNames({
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

		return React.createElement(
			"div",
			{ className: "rbc-reactiveelement-container" },
			React.createElement(
				"div",
				{ className: "rbc rbc-reactiveelement card thumbnail " + cx, style: this.props.componentStyle },
				title,
				this.state.resultStats && this.state.resultStats.resultFound && this.props.showResultStats ? React.createElement(ResultStats, { onResultStats: this.props.onResultStats, took: this.state.resultStats.took, total: this.state.resultStats.total }) : null,
				this.state.resultMarkup,
				this.state.showPlaceholder ? placeholder : null
			),
			this.props.noResults && this.state.visibleNoResults ? React.createElement(NoResults, { defaultText: this.props.noResults.text }) : null,
			this.props.initialLoader && this.state.queryStart ? React.createElement(InitialLoader, { defaultText: this.props.initialLoader.text }) : null,
			React.createElement(PoweredBy, { container: "rbc-reactiveelement-container" })
		);
	};

	return ReactiveElement;
}(Component);

export default ReactiveElement;


ReactiveElement.propTypes = {
	componentId: React.PropTypes.string,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	from: helper.validation.resultListFrom,
	onAllData: React.PropTypes.func,
	size: helper.sizeValidation,
	stream: React.PropTypes.bool,
	componentStyle: React.PropTypes.object,
	initialLoader: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	noResults: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	showResultStats: React.PropTypes.bool,
	onResultStats: React.PropTypes.func,
	react: React.PropTypes.object,
	placeholder: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
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
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	app: React.PropTypes.any.isRequired
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