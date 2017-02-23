import * as ChannelHelper from "./ChannelHelper";

const { EventEmitter } = require("fbemitter");
const helper = require("./helper");

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
	receive(depend, channelId, queryOptions = null) {
		const self = this;
		const channelObj = this.channels[channelId];
		let queryObj;

		function setQueryState(channelResponse) {
			const obj = JSON.parse(JSON.stringify(channelResponse));
			obj.queryState = true;
			self.emitter.emit(`${channelId}-query`, obj);
		}

		function activateStream(currentChannelId, currentQueryObj, appbaseRef) {
			if (this.streamRef[currentChannelId]) {
				this.streamRef[currentChannelId].stop();
			}
			const streamQueryObj = JSON.parse(JSON.stringify(currentQueryObj));
			streamQueryObj.type = this.type[currentChannelId];
			if (streamQueryObj.body) {
				delete streamQueryObj.body.from;
				delete streamQueryObj.body.size;
				delete streamQueryObj.body.sort;
			}
			this.streamRef[currentChannelId] = appbaseRef.searchStream(streamQueryObj).on("data", (data) => {
				const obj = {
					mode: "streaming",
					data,
					appliedQuery: currentQueryObj
				};
				self.emitter.emit(currentChannelId, obj);
			}).on("error", (error) => {
				console.log(error);
			});
		}
		if (!queryOptions) {
			queryObj = ChannelHelper.queryBuild(channelObj, channelObj.previousSelectedSensor);
			this.queryOptions[channelId] = channelObj.previousSelectedSensor[`channel-options-${channelId}`];
		} else {
			queryObj = ChannelHelper.queryBuild(channelObj, queryOptions);
		}
		let validQuery = true;
		try {
			validQuery = !!(queryObj && Object.keys(queryObj).length);
		} catch (e) {
			console.log(e);
		}

		if (validQuery) {
			const channelResponse = {
				startTime: (new Date()).getTime(),
				appliedQuery: queryObj
			};
			const appbaseRef = this.appbaseRef[channelId];
			if (appbaseRef) {
				// apply search query and emit historic queryResult
				const searchQueryObj = queryObj;
				searchQueryObj.type = this.type[channelId] === "*" ? "" : this.type[channelId];
				setQueryState(channelResponse);
				appbaseRef.search(searchQueryObj).on("data", (data) => {
					channelResponse.mode = "historic";
					channelResponse.data = data;
					self.emitter.emit(channelId, channelResponse);
					const globalQueryOptions = self.queryOptions && self.queryOptions[channelId] ? self.queryOptions[channelId] : {};
					self.emitter.emit("global", {
						channelResponse,
						react: channelObj.react,
						queryOptions: globalQueryOptions
					});
				}).on("error", (error) => {
					const channelError = {
						appliedQuery: channelResponse.appliedQuery,
						error,
						startTime: channelResponse.startTime
					};
					self.emitter.emit(channelId, channelError);
				});
				// apply searchStream query and emit streaming data
				if (channelObj.stream) {
					activateStream.call(this, channelId, queryObj, appbaseRef);
				}
			} else {
				console.error(`appbaseRef is not set for ${channelId}`);
			}
		} else {
			const obj = {
				mode: "historic",
				startTime: (new Date()).getTime(),
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
	stopStream(channelId) {
		// debugger
		if (this.streamRef[channelId]) {
			this.streamRef[channelId].stop();
		}
		if (this.channels[channelId] && this.channels[channelId].watchDependency) {
			this.channels[channelId].watchDependency.stop();
			delete this.channels[channelId];
		}
	}

	nextPage(channelId) {
		const queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
		const options = {
			size: this.queryOptions[channelId].size,
			from: this.queryOptions[channelId].from + this.queryOptions[channelId].size
		};
		queryOptions[`channel-options-${channelId}`] = JSON.parse(JSON.stringify(options));
		// queryOptions["channel-options-"+channelId].from += 1;
		this.queryOptions[channelId] = options;
		this.receive(`channel-options-${channelId}`, channelId, queryOptions);
	}

	// callback on page number changes
	paginationChanges(pageNumber, channelId) {
		const queryOptions = JSON.parse(JSON.stringify(this.channels[channelId].previousSelectedSensor));
		const options = {
			size: this.queryOptions[channelId].size,
			from: (this.queryOptions[channelId].size * (pageNumber - 1)) + 1
		};
		queryOptions[`channel-options-${channelId}`] = JSON.parse(JSON.stringify(options));
		// queryOptions["channel-options-"+channelId].from += 1;
		this.queryOptions[channelId] = options;
		this.receive(`channel-options-${channelId}`, channelId, queryOptions);
	}

	// sort changes
	sortChanges(channelId) {
		this.receive(`channel-options-${channelId}`, channelId);
	}

	// Create the channel by passing react
	// if react are same it will create single channel for them
	create(appbaseRef, type, react, size = 100, from = 0, stream = false) {
		const channelId = btoa(JSON.stringify(react));
		const optionValues = {
			size,
			from
		};
		this.queryOptions[channelId] = optionValues;
		this.type[channelId] = type;
		this.appbaseRef[channelId] = appbaseRef;
		react[`channel-options-${channelId}`] = optionValues;
		const previousSelectedSensor = {
			[`channel-options-${channelId}`]: optionValues
		};
		const obj = {
			key: `channel-options-${channelId}`,
			value: optionValues
		};
		const serializeDepends = helper.serializeDepends.serialize(react);
		helper.selectedSensor.set(obj);
		if (!((channelId in this.channels) && stream === this.channels[channelId].stream)) {
			this.channels[channelId] = {
				react,
				size,
				from,
				stream,
				previousSelectedSensor,
				serializeDepends,
				watchDependency: new helper.WatchForDependencyChange(serializeDepends.dependsList, previousSelectedSensor, this.receive, channelId, this.paginationChanges, this.sortChanges)
			};
			this.channels[channelId].watchDependency.start();
		}
		setTimeout(() => {
			if ("aggs" in react) {
				this.receive("aggs", channelId);
			}
		}, 100);
		return {
			channelId,
			emitter: this.emitter
		};
	}
}
const manager = new ChannelManager();
export default manager;
