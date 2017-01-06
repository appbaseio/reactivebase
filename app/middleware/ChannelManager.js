var {EventEmitter} = require('fbemitter');
var helper = require('./helper.js');

class channelManager {
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
			queryObj = this.queryBuild(channelObj.depends, channelObj.previousSelectedSensor, channelObj.size, channelObj.from);
			this.queryOptions[channelId] = channelObj.previousSelectedSensor['channel-options-'+channelId];
		} else {
			queryObj = this.queryBuild(channelObj.depends, queryOptions, channelObj.size, channelObj.from);
		}
		let validQuery = true;
		try {
			validQuery = !queryObj.body.aggs && queryObj.body.query.bool.should.length === 0 ? false : true;
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
				appbaseRef.search(searchQueryObj).on('data', function(data) {
					channelResponse.mode = 'historic';
					channelResponse.data = data;
					self.emitter.emit(channelId, channelResponse);
					let globalQueryOptions = self.queryOptions && self.queryOptions[channelId] ? self.queryOptions[channelId] : {};
					self.emitter.emit('global', {
						channelResponse: channelResponse,
						depends: channelObj.depends,
						queryOptions: globalQueryOptions
					});
				}).on('error', function(error) {
					console.log(error);
				});
				// apply searchStream query and emit streaming data
				if(this.streamRef[channelId]) {
					this.streamRef[channelId].stop();
				}
				let streamQueryObj = queryObj;
				streamQueryObj.type = this.type[channelId];
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
	}

	// stopStream
	// Clear channel streaming request
	stopStream(channelId) {
		if(this.streamRef[channelId]) {
			this.streamRef[channelId].stop();
		}
	}

	// queryBuild
	// Builds the query by using depends object and values of sensor
	queryBuild(depends, previousSelectedSensor, size, from=0) {
		let aggs = null;
		let mustArray = [];
		let shouldArray = [];
		let requestOptions = {};
		let sortObj = [];
		for(let depend in depends) {
			if(depend === 'aggs') {
				aggs = aggsQuery(depend);
			} else if(depend.indexOf('channel-options-') > -1) {
				requestOptions = previousSelectedSensor[depend];
			} else {
				let queryObj = null;
				if(depends[depend].defaultQuery) {
					queryObj = depends[depend].defaultQuery(previousSelectedSensor[depend]);
				} else {
					queryObj = singleQuery(depend);
				}
				if(queryObj) {
					if(depends[depend].operation === 'must') {
						mustArray.push(queryObj);
					}
					else if(depends[depend].operation === 'should') {
						shouldArray.push(queryObj);
					}
				}
			}
			let sortField = sortAvailable(depend);
			if(sortField) {
				sortObj.push(sortField);
			}
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
			if(sensorInfo && sensorInfo.defaultQuery) {
				s_query = sensorInfo.defaultQuery(previousSelectedSensor[depend]);
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
			let aggsObj = depends[depend];
			let order, type;
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
		if(mustArray.length) {
				let mustObject = {
					bool: {
						must: mustArray
					}
				};
				shouldArray.push(mustObject);
		}

		let query = {
			body: {
				"query": {
					"bool": {
						"should": shouldArray,
						"minimum_should_match": 1
					}
				}
			}
		};
		if(aggs) {
			query.body.aggs = aggs;
		}
		if(sortObj && sortObj.length) {
			query.body.sort = sortObj;
		}
		// apply request options
		if(requestOptions && Object.keys(requestOptions).length) {
			for(let reqOption in requestOptions) {
				query.body[reqOption] = requestOptions[reqOption];
			}
		}
		return query;
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

	// Create the channel by passing depends
	// if depends are same it will create single channel for them
	create(appbaseRef, type, depends, size = 100, from =0) {
		let channelId = btoa(JSON.stringify(depends));
		let optionValues = {
			size: size,
			from: from
		};
		this.queryOptions[channelId] = optionValues;
		this.type[channelId] = type;
		this.appbaseRef[channelId] = appbaseRef;
		depends['channel-options-'+channelId] = optionValues;
		let previousSelectedSensor = {
			['channel-options-'+channelId]: optionValues
		};
		let obj = {
			key: 'channel-options-' + channelId,
			value: optionValues
		};
		helper.selectedSensor.set(obj);
		if(!this.channels.hasOwnProperty(channelId)) {
			this.channels[channelId] = {
				depends: depends,
				size: size,
				from: from,
				previousSelectedSensor: previousSelectedSensor
			};
			helper.watchForDependencyChange(depends, this.channels[channelId].previousSelectedSensor, this.receive, channelId, this.paginationChanges, this.sortChanges);
		}
		setTimeout(() => {
			if(depends.hasOwnProperty('aggs')) {
				this.receive('aggs', channelId)
			}
		}, 100);
		return {
			channelId: channelId,
			emitter: this.emitter
		};
	}
};
export const manager = new channelManager();
