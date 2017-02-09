'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('fbemitter');

var EventEmitter = _require.EventEmitter;

var helper = require('./helper.js');

var channelManager = function () {
	function channelManager() {
		_classCallCheck(this, channelManager);

		this.emitter = new EventEmitter();
		this.channels = {};
		this.streamRef = {};
		this.queryOptions = {};
		this.appbaseRef = {};
		this.type = {};
		this.receive = this.receive.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.paginationChanges = this.paginationChanges.bind(this);
		this.sortChanges = this.sortChanges.bind(this);
	}

	// Receive: This method will be executed whenever dependency value changes
	// It receives which dependency changes and which channeldId should be affected.


	_createClass(channelManager, [{
		key: 'receive',
		value: function receive(depend, channelId) {
			var _this = this;

			var queryOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			var self = this;
			var channelObj = this.channels[channelId];
			var queryObj = void 0;
			if (!queryOptions) {
				queryObj = this.queryBuild(channelObj.actuate, channelObj.previousSelectedSensor, channelObj.size, channelObj.from);
				this.queryOptions[channelId] = channelObj.previousSelectedSensor['channel-options-' + channelId];
			} else {
				queryObj = this.queryBuild(channelObj.actuate, queryOptions, channelObj.size, channelObj.from);
			}
			var validQuery = true;
			try {
				validQuery = !queryObj.body.aggs && queryObj.body.query.bool.should.length === 0 ? false : true;
			} catch (e) {}

			if (validQuery) {
				(function () {
					var channelResponse = {
						startTime: new Date().getTime(),
						appliedQuery: queryObj
					};
					var appbaseRef = _this.appbaseRef[channelId];
					if (appbaseRef) {
						// apply search query and emit historic queryResult
						var searchQueryObj = queryObj;
						searchQueryObj.type = _this.type[channelId] == '*' ? '' : _this.type[channelId];
						appbaseRef.search(searchQueryObj).on('data', function (data) {
							channelResponse.mode = 'historic';
							channelResponse.data = data;
							self.emitter.emit(channelId, channelResponse);
							var globalQueryOptions = self.queryOptions && self.queryOptions[channelId] ? self.queryOptions[channelId] : {};
							self.emitter.emit('global', {
								channelResponse: channelResponse,
								actuate: channelObj.actuate,
								queryOptions: globalQueryOptions
							});
						}).on('error', function (error) {
							console.log(error);
						});
						// apply searchStream query and emit streaming data
						if (channelObj.stream) {
							activateStream.call(_this, channelId, queryObj, appbaseRef);
						}
					} else {
						console.error('appbaseRef is not set for ' + channelId);
					}
				})();
			} else {
				var obj = _defineProperty({
					mode: 'historic',
					startTime: new Date().getTime(),
					appliedQuery: queryObj,
					data: {
						_shards: {},
						hits: {
							hits: []
						}
					}
				}, 'appliedQuery', queryObj);
				self.emitter.emit(channelId, obj);
			}

			function activateStream(channelId, queryObj, appbaseRef) {
				if (this.streamRef[channelId]) {
					this.streamRef[channelId].stop();
				}
				var streamQueryObj = JSON.parse(JSON.stringify(queryObj));
				streamQueryObj.type = this.type[channelId];
				if (streamQueryObj.body) {
					delete streamQueryObj.body.from;
					delete streamQueryObj.body.size;
					delete streamQueryObj.body.sort;
				}
				this.streamRef[channelId] = appbaseRef.searchStream(streamQueryObj).on('data', function (data) {
					var obj = {
						mode: 'streaming',
						data: data,
						appliedQuery: queryObj
					};
					self.emitter.emit(channelId, obj);
				}).on('error', function (error) {
					console.log(error);
				});
			}
		}

		// stopStream
		// Clear channel streaming request

	}, {
		key: 'stopStream',
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

		// queryBuild
		// Builds the query by using actuate object and values of sensor

	}, {
		key: 'queryBuild',
		value: function queryBuild(actuate, previousSelectedSensor, size) {
			var from = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

			var aggs = null;
			var mustArray = [];
			var shouldArray = [];
			var requestOptions = {};
			var sortObj = [];
			for (var depend in actuate) {
				if (depend === 'aggs') {
					aggs = aggsQuery(depend);
				} else if (depend.indexOf('channel-options-') > -1) {
					requestOptions = previousSelectedSensor[depend];
				} else {
					var queryObj = null;
					if (actuate[depend].customQuery) {
						queryObj = actuate[depend].customQuery(previousSelectedSensor[depend]);
					} else {
						queryObj = singleQuery(depend);
					}
					if (queryObj) {
						if (actuate[depend].operation === 'must') {
							mustArray.push(queryObj);
						} else if (actuate[depend].operation === 'should') {
							shouldArray.push(queryObj);
						}
					}
				}
				var sortField = sortAvailable(depend);
				if (sortField && !sortField.hasOwnProperty('aggSort')) {
					sortObj.push(sortField);
				}
			}

			// check if sortinfo is availbale
			function sortAvailable(depend) {
				var sortInfo = helper.selectedSensor.get(depend, 'sortInfo');
				return sortInfo;
			}

			// build single query or if default query present in sensor itself use that
			function singleQuery(depend) {
				var sensorInfo = helper.selectedSensor.get(depend, 'sensorInfo');
				var s_query = null;
				if (sensorInfo && sensorInfo.customQuery) {
					s_query = sensorInfo.customQuery(previousSelectedSensor[depend]);
				} else if (previousSelectedSensor[depend]) {
					s_query = {};
					s_query[sensorInfo.queryType] = {};
					if (sensorInfo.queryType != 'match_all') {
						s_query[sensorInfo.queryType][sensorInfo.inputData] = previousSelectedSensor[depend];
					}
				}
				return s_query;
			}

			function aggsQuery(depend) {
				var aggsObj = actuate[depend];
				var order = void 0,
				    type = void 0;
				if (aggsObj.sortRef) {
					var _sortField = sortAvailable(aggsObj.sortRef);
					if (_sortField && _sortField.aggSort) {
						aggsObj.sort = _sortField.aggSort;
					}
				}
				if (aggsObj.sort == "count") {
					order = "desc";
					type = "_count";
				} else if (aggsObj.sort == "asc") {
					order = "asc";
					type = "_term";
				} else {
					order = "desc";
					type = "_term";
				}
				var orderQuery = '{\n\t\t\t\t"' + type + '" : "' + order + '"\n\t\t\t}';
				return JSON.parse('{\n\t\t\t\t"' + aggsObj.key + '": {\n\t\t\t\t\t"terms": {\n\t\t\t\t\t\t"field": "' + aggsObj.key + '",\n\t\t\t\t\t\t"size": ' + aggsObj.size + ',\n\t\t\t\t\t\t"order": ' + orderQuery + '\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}');
			}
			if (mustArray.length) {
				var mustObject = {
					bool: {
						must: mustArray
					}
				};
				shouldArray.push(mustObject);
			}

			var query = {
				body: {
					"query": {
						"bool": {
							"should": shouldArray,
							"minimum_should_match": 1
						}
					}
				}
			};
			if (aggs) {
				query.body.aggs = aggs;
			}
			if (sortObj && sortObj.length) {
				query.body.sort = sortObj;
			}
			// apply request options
			if (requestOptions && Object.keys(requestOptions).length) {
				for (var reqOption in requestOptions) {
					query.body[reqOption] = requestOptions[reqOption];
				}
			}
			return query;
		}
	}, {
		key: 'nextPage',
		value: function nextPage(channelId) {
			var channelObj = this.channels[channelId];
			var queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
			var channelOptionsObj = channelObj.previousSelectedSensor['channel-options-' + channelId];
			var options = {
				size: this.queryOptions[channelId].size,
				from: this.queryOptions[channelId].from + this.queryOptions[channelId].size
			};
			queryOptions['channel-options-' + channelId] = JSON.parse(JSON.stringify(options));
			// queryOptions['channel-options-'+channelId].from += 1;
			this.queryOptions[channelId] = options;
			this.receive('channel-options-' + channelId, channelId, queryOptions);
		}

		// callback on page number changes

	}, {
		key: 'paginationChanges',
		value: function paginationChanges(pageNumber, channelId) {
			var channelObj = this.channels[channelId];
			var queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
			var channelOptionsObj = channelObj.previousSelectedSensor['channel-options-' + channelId];
			var options = {
				size: this.queryOptions[channelId].size,
				from: this.queryOptions[channelId].size * (pageNumber - 1) + 1
			};
			queryOptions['channel-options-' + channelId] = JSON.parse(JSON.stringify(options));
			// queryOptions['channel-options-'+channelId].from += 1;
			this.queryOptions[channelId] = options;
			this.receive('channel-options-' + channelId, channelId, queryOptions);
		}

		// sort changes

	}, {
		key: 'sortChanges',
		value: function sortChanges(channelId) {
			this.receive('channel-options-' + channelId, channelId);
		}

		// Create the channel by passing actuate
		// if actuate are same it will create single channel for them

	}, {
		key: 'create',
		value: function create(appbaseRef, type, actuate) {
			var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;

			var _this2 = this;

			var from = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
			var stream = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

			var channelId = btoa(JSON.stringify(actuate));
			var optionValues = {
				size: size,
				from: from
			};
			this.queryOptions[channelId] = optionValues;
			this.type[channelId] = type;
			this.appbaseRef[channelId] = appbaseRef;
			actuate['channel-options-' + channelId] = optionValues;
			var previousSelectedSensor = _defineProperty({}, 'channel-options-' + channelId, optionValues);
			var obj = {
				key: 'channel-options-' + channelId,
				value: optionValues
			};
			helper.selectedSensor.set(obj);
			if (!(this.channels.hasOwnProperty(channelId) && stream === this.channels[channelId].stream)) {
				this.channels[channelId] = {
					actuate: actuate,
					size: size,
					from: from,
					stream: stream,
					previousSelectedSensor: previousSelectedSensor,
					watchDependency: new helper.watchForDependencyChange(actuate, previousSelectedSensor, this.receive, channelId, this.paginationChanges, this.sortChanges)
				};
				this.channels[channelId].watchDependency.start();
			}
			setTimeout(function () {
				if (actuate.hasOwnProperty('aggs')) {
					_this2.receive('aggs', channelId);
				}
			}, 100);
			return {
				channelId: channelId,
				emitter: this.emitter
			};
		}
	}]);

	return channelManager;
}();

;
var manager = exports.manager = new channelManager();