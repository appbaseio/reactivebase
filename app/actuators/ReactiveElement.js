import React, { Component } from 'react';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
import JsonPrint from '../addons/JsonPrint';
import PoweredBy from '../sensors/PoweredBy';
import InitialLoader from '../addons/InitialLoader';
import NoResults from '../addons/NoResults';
import ResultStats from '../addons/ResultStats';
var helper = require('../middleware/helper.js');
var $ = require('jquery');
var _ = require('lodash');

export default class ReactiveElement extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
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
		this.channelId = null;
		this.channelListener = null;
		this.queryStartTime = 0;
		this.appliedQuery = {};
	}

	componentDidMount() {
		this.streamProp = this.props.stream;
		this.initialize();
	}

	initialize(executeChannel = false) {
		this.createChannel(executeChannel);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		this.removeChannel();
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.streamProp != this.props.stream) {
				this.streamProp = this.props.stream;
				this.removeChannel();
				this.initialize(true);
			}
			if (this.size != this.props.size) {
				this.size = this.props.size;
				this.removeChannel();
				this.initialize(true);
			}
		}, 300);
	}

	removeChannel() {
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
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel(executeChannel = false) {
		// Set the react - add self aggs query as well with react
		let react = this.props.react ? this.props.react : {};
		if (react && react.and && typeof react.and === 'string') {
			react.and = [react.and];
		}
		react.and.push('streamChanges');
		if (this.sortObj) {
			this.enableSort(react);
		}
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, react, this.props.size, this.props.from, this.props.stream);
		this.channelId = channelObj.channelId;

		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function(res) {
			// implementation to prevent initialize query issue if old query response is late then the newer query
			// then we will consider the response of new query and prevent to apply changes for old query response.
			// if queryStartTime of channel response is greater than the previous one only then apply changes
			if (res.error && res.startTime > this.queryStartTime) {
				this.setState({
					queryStart: false,
					showPlaceholder: false
				});
				if (this.props.onData) {
					let modifiedData = helper.prepareResultData(data);
					this.props.onData(modifiedData.err, modifiedData.res);
				}
			}
			if (res.appliedQuery) {
				if (res.mode === 'historic' && res.startTime > this.queryStartTime) {
					let visibleNoResults = res.appliedQuery && res.data && !res.data.error ? (res.data.hits && res.data.hits.total ? false : true) : false;
					let resultStats = {
						resultFound: res.appliedQuery && res.data && !res.data.error && res.data.hits && res.data.hits.total ? true : false
					};
					if (res.appliedQuery && res.data && !res.data.error) {
						resultStats.total = res.data.hits.total;
						resultStats.took = res.data.took;
					}
					this.setState({
						queryStart: false,
						visibleNoResults: visibleNoResults,
						resultStats: resultStats,
						showPlaceholder: false
					});
					this.afterChannelResponse(res);
				} else if (res.mode === 'streaming') {
					this.afterChannelResponse(res);
				}
			} else {
				this.setState({
					showPlaceholder: true
				});
			}
		}.bind(this));
		this.listenLoadingChannel(channelObj);
		if (executeChannel) {
			var obj = {
				key: 'streamChanges',
				value: ''
			};
			helper.selectedSensor.set(obj, true);
		}
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(channelObj.channelId + '-query', function(res) {
			if (res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		}.bind(this));
	}

	afterChannelResponse(res) {
		let data = res.data;
		let rawData, markersData, newData = [],
			currentData = [];
		this.streamFlag = false;
		if (res.mode === 'streaming') {
			this.channelMethod = 'streaming';
			newData = res.data;
			newData.stream = true;
			currentData = this.state.currentData;
			this.streamFlag = true;
			markersData = this.setMarkersData(rawData);
		} else if (res.mode === 'historic') {
			this.queryStartTime = res.startTime;
			this.channelMethod = 'historic';
			newData = res.data.hits && res.data.hits.hits ? res.data.hits.hits : [];
			let normalizeCurrentData = this.normalizeCurrentData(res, this.state.currentData, newData);
			newData = normalizeCurrentData.newData;
			currentData = normalizeCurrentData.currentData;
		}
		this.setState({
			rawData: rawData,
			newData: newData,
			currentData: currentData,
			markersData: markersData,
			isLoading: false
		}, function() {
			// Pass the historic or streaming data in index method
			res.allMarkers = rawData;
			let modifiedData = JSON.parse(JSON.stringify(res));
			modifiedData.newData = this.state.newData;
			modifiedData.currentData = this.state.currentData;
			delete modifiedData.data;
			modifiedData = helper.prepareResultData(modifiedData, res.data);
			let generatedData = this.props.onData ? this.props.onData(modifiedData.err, modifiedData.res) : this.defaultonData(modifiedData.err, modifiedData.res);
			this.setState({
				resultMarkup: generatedData,
				currentData: this.combineCurrentData(newData)
			});
			if (this.streamFlag) {
				this.streamMarkerInterval();
			}
		}.bind(this));
	}

	// Check if stream data exists in markersData
	// and if exists the call streamToNormal.
	streamMarkerInterval() {
		let markersData = this.state.markersData;
		let isStreamData = markersData.filter((hit) => hit.stream && hit.streamStart);
		if (isStreamData.length) {
			this.isStreamDataExists = true;
			setTimeout(() => this.streamToNormal(), this.props.streamActiveTime * 1000);
		} else {
			this.isStreamDataExists = false;
		}
	}

	// normalize current data
	normalizeCurrentData(res, rawData, newData) {
		let appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
		let currentData = JSON.stringify(appliedQuery) === JSON.stringify(this.appliedQuery) ? (rawData ? rawData : []) : [];
		if (!currentData.length) {
			this.appliedQuery = appliedQuery;
		} else {
			newData = newData.filter((newRecord) => {
				let notExits = true;
				currentData.forEach((oldRecord) => {
					if (newRecord._id + '-' + newRecord._type === oldRecord._id + '-' + oldRecord._type) {
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

	combineCurrentData(newData) {
		if (_.isArray(newData)) {
			return this.state.currentData.concat(newData);
		} else {
			return this.streamDataModify(this.state.currentData, newData)
		}
	}

	// append stream boolean flag and also start time of stream
	streamDataModify(rawData, data) {
		if (data) {
			data.stream = true;
			data.streamStart = new Date();
			if (data._deleted) {
				let hits = rawData.filter((hit) => {
					return hit._id !== data._id;
				});
				rawData = hits;
			} else {
				let prevData = rawData.filter((hit) => {
					return hit._id === data._id;
				});
				let hits = rawData.filter((hit) => {
					return hit._id !== data._id;
				});
				rawData = hits;
				rawData.unshift(data);
			}
		}
		return rawData;
	}

	// tranform the raw data to marker data
	setMarkersData(hits) {
		var self = this;
		if (hits) {
			return hits;
		} else {
			return [];
		}
	}

	// default markup
	defaultonData(err, res) {
		let result = null;
		if (res && res.appliedQuery) {
			result = (
				<div className="row" style={{'marginTop': '60px'}}>
					<pre className="pull-left">
						{JSON.stringify(res.newData, null, 4)}
					</pre>
				</div>
			);
		}
		return result;
	}

	render() {
		let title = null,
			placeholder = null,
			sortOptions = null;
		let cx = classNames({
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title,
			'rbc-placeholder-active': this.props.placeholder,
			'rbc-placeholder-inactive': !this.props.placeholder,
			'rbc-stream-active': this.props.stream,
			'rbc-stream-inactive': !this.props.stream
		});

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		if (this.props.placeholder) {
			placeholder = (<div className="rbc-placeholder col s12 col-xs-12">{this.props.placeholder}</div>);
		}

		return (
			<div className="rbc-reactiveelement-container">
				<div ref="ListContainer" className={`rbc rbc-reactiveelement card thumbnail ${cx}`} style={this.props.componentStyle}>
					{title}
					{this.props.resultStats && this.state.resultStats.resultFound ? (<ResultStats setText={this.props.resultStats.setText} took={this.state.resultStats.took} total={this.state.resultStats.total}></ResultStats>) : null}
					{this.state.resultMarkup}
					{this.state.showPlaceholder ? placeholder : null}
				</div >
				{this.props.noResults ? (<NoResults defaultText={this.props.noResults.text} visible={this.state.visibleNoResults}></NoResults>) : null}
				{this.props.initialLoader ? (<InitialLoader defaultText={this.props.initialLoader.text} queryState={this.state.queryStart}></InitialLoader>) : null}
				<PoweredBy></PoweredBy>
			</div>
		)
	}
}

ReactiveElement.propTypes = {
	componentId: React.PropTypes.string,
	title: React.PropTypes.string,
	from: helper.validation.resultListFrom,
	onData: React.PropTypes.func,
	size: helper.sizeValidation,
	stream: React.PropTypes.bool,
	componentStyle: React.PropTypes.object,
	initialLoader: React.PropTypes.shape({
		text: React.PropTypes.string
	}),
	noResults: React.PropTypes.shape({
		text: React.PropTypes.string
	}),
	resultStats: React.PropTypes.shape({
		setText: React.PropTypes.func
	}),
	react: React.PropTypes.object,
	placeholder: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
		React.PropTypes.element
	])
};

ReactiveElement.defaultProps = {
	from: 0,
	size: 20,
	stream: false,
	ShowNoResults: true,
	ShowResultStats: true,
	componentStyle: {}
};

// context type
ReactiveElement.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
