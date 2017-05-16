"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChannelHelper = require("./ChannelHelper");

var ChannelHelper = _interopRequireWildcard(_ChannelHelper);

var _fbemitter = require("fbemitter");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var helper = require("./helper");

var ChannelManager = function () {
	function ChannelManager() {
		_classCallCheck(this, ChannelManager);

		this.emitter = new _fbemitter.EventEmitter();
		this.channels = {};
		this.streamRef = {};
		this.queryOptions = {};
		this.appbaseRef = {};
		this.type = {};
		this.app = {};
		this.receive = this.receive.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.paginationChanges = this.paginationChanges.bind(this);
		this.sortChanges = this.sortChanges.bind(this);
	}

	_createClass(ChannelManager, [{
		key: "highlightModify",
		value: function highlightModify(data, queryObj) {
			if (queryObj && queryObj.body && queryObj.body.highlight && data && data.hits && data.hits.hits && data.hits.hits.length) {
				data.hits.hits = data.hits.hits.map(this.highlightItem);
			}
			return data;
		}
	}, {
		key: "highlightItem",
		value: function highlightItem(item) {
			if (item.highlight) {
				Object.keys(item.highlight).forEach(function (highlightItem) {
					var highlightValue = item.highlight[highlightItem][0];
					_lodash2.default.set(item._source, highlightItem, highlightValue);
				});
			}
			return item;
		}

		// Receive: This method will be executed whenever dependency value changes
		// It receives which dependency changes and which channeldId should be affected.

	}, {
		key: "receive",
		value: function receive(depend, channelId) {
			var _this2 = this;

			var queryOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			var self = this;
			var channelObj = this.channels[channelId];
			var queryObj = void 0;

			function setQueryState(channelResponse) {
				var obj = JSON.parse(JSON.stringify(channelResponse));
				obj.queryState = true;
				self.emitter.emit(channelId + "-query", obj);
			}

			function activateStream(currentChannelId, currentQueryObj, appbaseRef) {
				var _this = this;

				if (this.streamRef[currentChannelId]) {
					this.streamRef[currentChannelId].stop();
				}
				var streamQueryObj = JSON.parse(JSON.stringify(currentQueryObj));
				streamQueryObj.type = this.type[currentChannelId];
				if (streamQueryObj.body) {
					delete streamQueryObj.body.from;
					delete streamQueryObj.body.size;
					delete streamQueryObj.body.sort;
				}
				this.streamRef[currentChannelId] = appbaseRef.searchStream(streamQueryObj).on("data", function (data) {
					data = _this.highlightItem(data, currentQueryObj);
					var obj = {
						mode: "streaming",
						data: data,
						appliedQuery: currentQueryObj
					};
					self.emitter.emit(currentChannelId, obj);
				}).on("error", function (error) {
					console.log(error);
				});
			}
			if (!queryOptions) {
				queryObj = ChannelHelper.queryBuild(channelObj, channelObj.previousSelectedSensor);
				this.queryOptions[channelId] = channelObj.previousSelectedSensor["channel-options-" + channelId];
			} else {
				queryObj = ChannelHelper.queryBuild(channelObj, queryOptions);
			}
			var validQuery = true;
			try {
				validQuery = !!(queryObj && Object.keys(queryObj).length);
			} catch (e) {
				console.log(e);
			}

			if (validQuery) {
				var channelResponse = {
					startTime: new Date().getTime(),
					appliedQuery: queryObj
				};
				var appbaseRef = this.appbaseRef[channelId];
				if (appbaseRef) {
					// apply search query and emit historic queryResult
					var searchQueryObj = queryObj;
					searchQueryObj.type = this.type[channelId] === "*" ? "" : this.type[channelId];
					searchQueryObj.preference = this.app[channelId];
					setQueryState(channelResponse);
					// console.log(JSON.stringify(searchQueryObj, null, 4));
					appbaseRef.search(searchQueryObj).on("data", function (data) {
						channelResponse.mode = "historic";
						channelResponse.data = _this2.highlightModify(data, channelResponse.appliedQuery);
						self.emitter.emit(channelId, channelResponse);
						var globalQueryOptions = self.queryOptions && self.queryOptions[channelId] ? self.queryOptions[channelId] : {};
						self.emitter.emit("global", {
							channelResponse: channelResponse,
							react: channelObj.react,
							queryOptions: globalQueryOptions
						});
					}).on("error", function (error) {
						var channelError = {
							appliedQuery: channelResponse.appliedQuery,
							error: error,
							startTime: channelResponse.startTime
						};
						self.emitter.emit(channelId, channelError);
					});
					// apply searchStream query and emit streaming data
					if (channelObj.stream) {
						activateStream.call(this, channelId, queryObj, appbaseRef);
					}
				} else {
					console.error("appbaseRef is not set for " + channelId);
				}
			} else {
				var obj = {
					mode: "historic",
					startTime: new Date().getTime(),
					appliedQuery: queryObj,
					data: {
						_shards: {},
						hits: {
							hits: []
						}
					}
				};
				self.emitter.emit(channelId, obj);
			}
		}

		// stopStream
		// Clear channel streaming request

	}, {
		key: "stopStream",
		value: function stopStream(channelId) {
			// debugger
			if (this.streamRef[channelId]) {
				this.streamRef[channelId].stop();
			}
			if (this.channels[channelId] && this.channels[channelId].watchDependency) {
				this.channels[channelId].watchDependency.stop();
				delete this.channels[channelId];
			}
		}
	}, {
		key: "nextPage",
		value: function nextPage(channelId) {
			var queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
			var options = {
				size: this.queryOptions[channelId].size,
				from: this.queryOptions[channelId].from + this.queryOptions[channelId].size
			};
			queryOptions["channel-options-" + channelId] = JSON.parse(JSON.stringify(options));
			// queryOptions["channel-options-"+channelId].from += 1;
			this.queryOptions[channelId] = options;
			this.receive("channel-options-" + channelId, channelId, queryOptions);
		}

		// callback on page number changes

	}, {
		key: "paginationChanges",
		value: function paginationChanges(pageNumber, channelId) {
			var queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
			var options = {
				size: this.queryOptions[channelId].size,
				from: this.getFrom(pageNumber, channelId)
			};
			queryOptions["channel-options-" + channelId] = JSON.parse(JSON.stringify(options));
			// queryOptions["channel-options-"+channelId].from += 1;
			this.queryOptions[channelId] = options;
			this.receive("channel-options-" + channelId, channelId, queryOptions);
		}
	}, {
		key: "getFrom",
		value: function getFrom(pageNumber, channelId) {
			return pageNumber !== 1 ? this.queryOptions[channelId].size * (pageNumber - 1) + 1 : 0;
		}

		// sort changes

	}, {
		key: "sortChanges",
		value: function sortChanges(channelId) {
			this.receive("channel-options-" + channelId, channelId);
		}

		// Create the channel by passing react
		// if react are same it will create single channel for them

	}, {
		key: "create",
		value: function create(appbaseRef, type, react) {
			var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
			var from = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

			var _this3 = this;

			var stream = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
			var app = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "reactivebase";

			var channelId = btoa(JSON.stringify(react));
			var optionValues = {
				size: size,
				from: from
			};
			this.queryOptions[channelId] = optionValues;
			this.type[channelId] = type;
			this.app[channelId] = app;
			this.appbaseRef[channelId] = appbaseRef;
			react["channel-options-" + channelId] = optionValues;
			var previousSelectedSensor = _defineProperty({}, "channel-options-" + channelId, optionValues);
			var obj = {
				key: "channel-options-" + channelId,
				value: optionValues
			};
			var serializeDepends = helper.serializeDepends.serialize(react);
			helper.selectedSensor.set(obj);
			if (!(channelId in this.channels && stream === this.channels[channelId].stream)) {
				this.channels[channelId] = {
					react: react,
					size: size,
					from: from,
					stream: stream,
					previousSelectedSensor: previousSelectedSensor,
					serializeDepends: serializeDepends,
					watchDependency: new helper.WatchForDependencyChange(serializeDepends.dependsList, previousSelectedSensor, this.receive, channelId, this.paginationChanges, this.sortChanges)
				};
				this.channels[channelId].watchDependency.start();
			}
			setTimeout(function () {
				if ("aggs" in react) {
					_this3.receive("aggs", channelId);
				}
			}, 100);
			return {
				channelId: channelId,
				emitter: this.emitter
			};
		}
	}]);

	return ChannelManager;
}();

var manager = new ChannelManager();
exports.default = manager;