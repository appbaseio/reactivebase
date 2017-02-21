var {EventEmitter} = require('fbemitter');
var helper = require('./helper.js');

class ChannelManager {
	constructor() {
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
	receive(depend, channelId, queryOptions=null) {
		let self = this;
		let channelObj = this.channels[channelId];
		let queryObj;
		if(!queryOptions) {
			queryObj = this.queryBuild(channelObj, channelObj.previousSelectedSensor);
			this.queryOptions[channelId] = channelObj.previousSelectedSensor['channel-options-'+channelId];
		} else {
			queryObj = this.queryBuild(channelObj, queryOptions);
		}
		let validQuery = true;
		try {
			validQuery = queryObj && Object.keys(queryObj).length ? true : false;
		} catch(e) { }

		if(validQuery) {
			let channelResponse = {
				startTime: (new Date()).getTime(),
				appliedQuery: queryObj
			};
			let appbaseRef = this.appbaseRef[channelId];
			if(appbaseRef) {
				// apply search query and emit historic queryResult
				let searchQueryObj = queryObj;
				searchQueryObj.type = this.type[channelId] == '*' ? '' : this.type[channelId];
				setQueryState(channelResponse);
				appbaseRef.search(searchQueryObj).on('data', function(data) {
					channelResponse.mode = 'historic';
					channelResponse.data = data;
					self.emitter.emit(channelId, channelResponse);
					let globalQueryOptions = self.queryOptions && self.queryOptions[channelId] ? self.queryOptions[channelId] : {};
					self.emitter.emit('global', {
						channelResponse: channelResponse,
						react: channelObj.react,
						queryOptions: globalQueryOptions
					});
				}).on('error', function(error) {
					let channelError = {
						appliedQuery: channelResponse.appliedQuery,
						error: error,
						startTime: channelResponse.startTime
					};
					self.emitter.emit(channelId, channelError);
				});
				// apply searchStream query and emit streaming data
				if(channelObj.stream) {
					activateStream.call(this, channelId, queryObj, appbaseRef);
				}

			} else {
				console.error('appbaseRef is not set for '+channelId);
			}
		} else {
			let obj = {
				mode: 'historic',
				startTime: (new Date()).getTime(),
				appliedQuery: queryObj,
				data: {
					_shards: {},
					hits: {
						hits: []
					}
				},
				appliedQuery: queryObj
			};
			self.emitter.emit(channelId, obj);
		}

		function setQueryState(channelResponse) {
			let obj = JSON.parse(JSON.stringify(channelResponse));
			obj.queryState = true;
			self.emitter.emit(channelId+'-query', obj);
		}

		function activateStream(channelId, queryObj, appbaseRef) {
			if(this.streamRef[channelId]) {
				this.streamRef[channelId].stop();
			}
			let streamQueryObj = JSON.parse(JSON.stringify(queryObj));
			streamQueryObj.type = this.type[channelId];
			if(streamQueryObj.body) {
				delete streamQueryObj.body.from;
				delete streamQueryObj.body.size;
				delete streamQueryObj.body.sort;
			}
			this.streamRef[channelId] = appbaseRef.searchStream(streamQueryObj).on('data', function(data) {
				let obj = {
					mode: 'streaming',
					data: data,
					appliedQuery: queryObj
				};
				self.emitter.emit(channelId, obj);
			}).on('error', function(error) {
				console.log(error);
			});
		}
	}

	// stopStream
	// Clear channel streaming request
	stopStream(channelId) {
		// debugger
		if(this.streamRef[channelId]) {
			this.streamRef[channelId].stop();
		}
		if(this.channels[channelId] && this.channels[channelId].watchDependency) {
			this.channels[channelId].watchDependency.stop();
			delete this.channels[channelId];
		}
	}

	// queryBuild
	// Builds the query by using react object and values of sensor
	queryBuild(channelObj, previousSelectedSensor) {
		let aggs = null;
		let sortObj = [];
		let requestOptions = null;
		let size = channelObj.size;
		let from = channelObj.from ? channelObj.from : 0;

		function initialize() {
			let dependsQuery = generateQuery();
			let query = combineQuery(dependsQuery);
			return query;
		}

		function generateQuery() {
			let dependsQuery = {};
			channelObj.serializeDepends.dependsList.forEach((depend) => {
				if(depend === 'aggs') {
					dependsQuery[depend] = aggsQuery(depend);
				} else if(depend && depend.indexOf('channel-options-') > -1) {
					requestOptions = previousSelectedSensor[depend];
				} else {
					dependsQuery[depend] = singleQuery(depend);
				}
				let sortField = sortAvailable(depend);
				if(sortField && !sortField.hasOwnProperty('aggSort')) {
					sortObj.push(sortField);
				}
			});
			return dependsQuery;
		}

		function combineQuery(dependsQuery) {
			let query = helper.serializeDepends.createQuery(channelObj.serializeDepends, dependsQuery);
			if(query && query.body) {
				if(sortObj && sortObj.length) {
					query.body.sort = sortObj;
				}
				// apply request options
				if(requestOptions && Object.keys(requestOptions).length) {
					for(let reqOption in requestOptions) {
						query.body[reqOption] = requestOptions[reqOption];
					}
				}
			}
			return query;
		}

		// check if sortinfo is availbale
		function sortAvailable(depend) {
			let sortInfo = helper.selectedSensor.get(depend, 'sortInfo');
			return sortInfo;
		}

		// build single query or if default query present in sensor itself use that
		function singleQuery(depend) {
			let sensorInfo = helper.selectedSensor.get(depend, 'sensorInfo');
			let s_query = null;
			if(sensorInfo && sensorInfo.customQuery) {
				s_query = sensorInfo.customQuery(previousSelectedSensor[depend]);
			}
			else if(previousSelectedSensor[depend]) {
				s_query = {};
				s_query[sensorInfo.queryType] = {};
				if (sensorInfo.queryType != 'match_all') {
					s_query[sensorInfo.queryType][sensorInfo.inputData] = previousSelectedSensor[depend];
				}
			}
			return s_query;
		}

		function aggsQuery(depend) {
			let aggsObj = channelObj.react[depend];
			let order, type;
			if(aggsObj.sortRef) {
				let sortField = sortAvailable(aggsObj.sortRef);
				if(sortField && sortField.aggSort) {
					aggsObj.sort = sortField.aggSort;
				}
			}
			if(aggsObj.sort=="count"){
				order = "desc";
				type = "_count";
			}
			else if(aggsObj.sort=="asc"){
				order = "asc";
				type = "_term";
			}
			else{
				order = "desc";
				type = "_term";
			}
			let orderQuery = `{
				"${type}" : "${order}"
			}`;
			return JSON.parse(`{
				"${aggsObj.key}": {
					"terms": {
						"field": "${aggsObj.key}",
						"size": ${aggsObj.size},
						"order": ${orderQuery}
					}
				}
			}`);
		}

		return initialize();


		// if(mustArray.length) {
		// 		let mustObject = {
		// 			bool: {
		// 				must: mustArray
		// 			}
		// 		};
		// 		shouldArray.push(mustObject);
		// }

		// let query = {
		// 	body: {
		// 		"query": {
		// 			"bool": {
		// 				"should": shouldArray,
		// 				"minimum_should_match": 1
		// 			}
		// 		}
		// 	}
		// };

		// if(aggs) {
		// 	query.body.aggs = aggs;
		// }
		// return query;
	}

	nextPage(channelId) {
		let channelObj = this.channels[channelId];
		let queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
		let channelOptionsObj = channelObj.previousSelectedSensor['channel-options-'+channelId];
		let options = {
			size: this.queryOptions[channelId].size,
			from: this.queryOptions[channelId].from + this.queryOptions[channelId].size
		};
		queryOptions['channel-options-'+channelId] = JSON.parse(JSON.stringify(options));
		// queryOptions['channel-options-'+channelId].from += 1;
		this.queryOptions[channelId] = options;
		this.receive('channel-options-'+channelId, channelId, queryOptions);
	}

	// callback on page number changes
	paginationChanges(pageNumber, channelId) {
		let channelObj = this.channels[channelId];
		let queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
		let channelOptionsObj = channelObj.previousSelectedSensor['channel-options-'+channelId];
		let options = {
			size: this.queryOptions[channelId].size,
			from: this.queryOptions[channelId].size*(pageNumber-1) + 1
		};
		queryOptions['channel-options-'+channelId] = JSON.parse(JSON.stringify(options));
		// queryOptions['channel-options-'+channelId].from += 1;
		this.queryOptions[channelId] = options;
		this.receive('channel-options-'+channelId, channelId, queryOptions);
	}

	// sort changes
	sortChanges(channelId) {
		this.receive('channel-options-'+channelId, channelId);
	}

	// Create the channel by passing react
	// if react are same it will create single channel for them
	create(appbaseRef, type, react, size = 100, from =0, stream=false) {
		let channelId = btoa(JSON.stringify(react));
		let optionValues = {
			size: size,
			from: from
		};
		this.queryOptions[channelId] = optionValues;
		this.type[channelId] = type;
		this.appbaseRef[channelId] = appbaseRef;
		react['channel-options-'+channelId] = optionValues;
		let previousSelectedSensor = {
			['channel-options-'+channelId]: optionValues
		};
		let obj = {
			key: 'channel-options-' + channelId,
			value: optionValues
		};
		let serializeDepends = helper.serializeDepends.serialize(react);
		helper.selectedSensor.set(obj);
		if(!(this.channels.hasOwnProperty(channelId) && stream === this.channels[channelId].stream)) {
			this.channels[channelId] = {
				react: react,
				size: size,
				from: from,
				stream: stream,
				previousSelectedSensor: previousSelectedSensor,
				serializeDepends: serializeDepends,
				watchDependency: new helper.watchForDependencyChange(serializeDepends.dependsList, previousSelectedSensor, this.receive, channelId, this.paginationChanges, this.sortChanges)
			};
			this.channels[channelId].watchDependency.start();
		}
		setTimeout(() => {
			if(react.hasOwnProperty('aggs')) {
				this.receive('aggs', channelId)
			}
		}, 100);
		return {
			channelId: channelId,
			emitter: this.emitter
		};
	}
}
export const manager = new ChannelManager();