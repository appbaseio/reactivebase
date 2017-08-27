import _isEqual from "lodash/isEqual";
import _set from "lodash/set";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import * as ChannelHelper from "./ChannelHelper";
import { EventEmitter } from "fbemitter";


var helper = require("./helper");

var ChannelManager = function () {
	function ChannelManager() {
		_classCallCheck(this, ChannelManager);

		this.emitter = new EventEmitter();
		this.channels = {};
		this.streamRef = {};
		this.queryOptions = {};
		this.appbaseRef = {};
		this.appbaseCrdentials = {};
		this.type = {};
		this.app = {};
		this.channelQueries = {};
		this.receive = this.receive.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.paginationChanges = this.paginationChanges.bind(this);
		this.sortChanges = this.sortChanges.bind(this);
	}

	ChannelManager.prototype.highlightModify = function highlightModify(data, queryObj) {
		if (queryObj && queryObj.body && queryObj.body.highlight && data && data.hits && data.hits.hits && data.hits.hits.length) {
			data.hits.hits = data.hits.hits.map(this.highlightItem);
		}
		return data;
	};

	ChannelManager.prototype.highlightItem = function highlightItem(item) {
		if (item.highlight) {
			Object.keys(item.highlight).forEach(function (highlightItem) {
				var highlightValue = item.highlight[highlightItem][0];
				_set(item._source, highlightItem, highlightValue);
			});
		}
		return item;
	};

	// Receive: This method will be executed whenever dependency value changes
	// It receives which dependency changes and which channeldId should be affected.


	ChannelManager.prototype.receive = function receive(depend, channelId) {
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

		var appbaseQuery = function appbaseQuery(appbaseRef, searchQueryObj, channelResponse, channelObj, queryObj, queryOptions) {
			appbaseRef.search(searchQueryObj).on("data", function (data) {
				channelResponse.mode = "historic";
				channelResponse.data = _this2.highlightModify(data, channelResponse.appliedQuery);
				_this2.emitter.emit(channelId, channelResponse);
				_this2.emitter.emit("global", {
					channelResponse: channelResponse,
					react: channelObj.react,
					queryOptions: queryOptions
				});
			}).on("error", function (error) {
				var channelError = {
					appliedQuery: channelResponse.appliedQuery,
					error: error,
					startTime: channelResponse.startTime
				};
				_this2.emitter.emit(channelId, channelError);
			});
			// apply searchStream query and emit streaming data
			if (channelObj.stream) {
				activateStream.call(_this2, channelId, queryObj, appbaseRef);
			}
		};

		if (channelObj) {
			if (!queryOptions) {
				queryObj = ChannelHelper.queryBuild(channelObj, channelObj.previousSelectedSensor);
				this.queryOptions[channelId] = channelObj.previousSelectedSensor["channel-options-" + channelId];
			} else {
				queryObj = ChannelHelper.queryBuild(channelObj, queryOptions);
			}
		}
		var validQuery = true;
		try {
			validQuery = queryObj && Object.keys(queryObj).length;
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
				if (!_isEqual(this.channelQueries[channelId], searchQueryObj)) {
					this.channelQueries[channelId] = searchQueryObj;
					setQueryState(channelResponse);
					var qOptions = this.queryOptions && this.queryOptions[channelId] ? this.queryOptions[channelId] : {};
					appbaseQuery(appbaseRef, searchQueryObj, channelResponse, channelObj, queryObj, qOptions);
				}
			} else {
				this.channelQueries[channelId] = queryObj;
				console.error("appbaseRef is not set for " + channelId);
			}
		} else {
			this.channelQueries[channelId] = queryObj;
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
	};

	// stopStream
	// Clear channel streaming request


	ChannelManager.prototype.stopStream = function stopStream(channelId) {
		if (this.streamRef[channelId]) {
			this.streamRef[channelId].stop();
		}
		if (this.channels[channelId] && this.channels[channelId].watchDependency) {
			this.channels[channelId].watchDependency.stop();
			delete this.channels[channelId];
		}
		if (this.channelQueries[channelId]) {
			delete this.channelQueries[channelId];
		}
	};

	ChannelManager.prototype.nextPage = function nextPage(channelId) {
		var queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
		var options = {
			size: this.queryOptions[channelId].size,
			from: this.queryOptions[channelId].from + this.queryOptions[channelId].size
		};
		queryOptions["channel-options-" + channelId] = JSON.parse(JSON.stringify(options));
		// queryOptions["channel-options-"+channelId].from += 1;
		this.queryOptions[channelId] = options;
		this.receive("channel-options-" + channelId, channelId, queryOptions);
	};

	// callback on page number changes


	ChannelManager.prototype.paginationChanges = function paginationChanges(pageNumber, channelId) {
		var queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
		var options = {
			size: this.queryOptions[channelId].size,
			from: this.getFrom(pageNumber, channelId)
		};
		queryOptions["channel-options-" + channelId] = JSON.parse(JSON.stringify(options));
		// queryOptions["channel-options-"+channelId].from += 1;
		this.queryOptions[channelId] = options;
		this.receive("channel-options-" + channelId, channelId, queryOptions);
	};

	ChannelManager.prototype.getFrom = function getFrom(pageNumber, channelId) {
		return pageNumber !== 1 ? this.queryOptions[channelId].size * (pageNumber - 1) : 0;
	};

	// sort changes


	ChannelManager.prototype.sortChanges = function sortChanges(channelId) {
		this.receive("channel-options-" + channelId, channelId);
	};

	// Create the channel by passing react
	// if react are same it will create single channel for them


	ChannelManager.prototype.create = function create(appbaseRef, type, react) {
		var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
		var from = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var stream = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

		var _previousSelectedSens;

		var app = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "reactivebase";
		var appbaseCrdentials = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;

		var channelId = btoa(JSON.stringify(react));
		var optionValues = {
			size: size,
			from: from
		};
		this.queryOptions[channelId] = optionValues;
		this.type[channelId] = type;
		this.app[channelId] = app;
		this.appbaseRef[channelId] = appbaseRef;
		this.appbaseCrdentials[channelId] = appbaseCrdentials;
		react["channel-options-" + channelId] = optionValues;
		var previousSelectedSensor = (_previousSelectedSens = {}, _previousSelectedSens["channel-options-" + channelId] = optionValues, _previousSelectedSens);
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
		if ("aggs" in react) {
			this.receive("aggs", channelId);
		}
		return {
			channelId: channelId,
			emitter: this.emitter
		};
	};

	ChannelManager.prototype.update = function update(channelId, react, size, from) {
		var _previousSelectedSens2;

		var stream = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

		var optionValues = this.queryOptions[channelId];
		if (size !== null && from !== null) {
			optionValues = {
				size: size,
				from: from
			};
		}
		react["channel-options-" + channelId] = optionValues;
		var previousSelectedSensor = (_previousSelectedSens2 = {}, _previousSelectedSens2["channel-options-" + channelId] = optionValues, _previousSelectedSens2);
		var obj = {
			key: "channel-options-" + channelId,
			value: optionValues
		};
		var serializeDepends = helper.serializeDepends.serialize(react);
		helper.selectedSensor.set(obj);
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
		if ("aggs" in react) {
			this.receive("aggs", channelId);
		}
	};

	return ChannelManager;
}();

var manager = new ChannelManager();
export default manager;