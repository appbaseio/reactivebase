import React, { Component } from "react";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import PoweredBy from "../sensors/PoweredBy";
import InitialLoader from "../addons/InitialLoader";
import NoResults from "../addons/NoResults";
import ResultStats from "../addons/ResultStats";
import * as TYPES from "../middleware/constants";
import _ from "lodash";

const helper = require("../middleware/helper");

export default class ReactiveElement extends Component {
	constructor(props) {
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

	// tranform the raw data to marker data
	setMarkersData(hits) {
		if (hits) {
			return hits;
		}
		return [];
	}

	// append stream boolean flag and also start time of stream
	streamDataModify(rawData, data) {
		if (data) {
			data.stream = true;
			data.streamStart = new Date();
			if (data._deleted) {
				const hits = rawData.filter(hit => hit._id !== data._id);
				rawData = hits;
			} else {
				const hits = rawData.filter(hit => hit._id !== data._id);
				rawData = hits;
				rawData.unshift(data);
			}
		}
		return rawData;
	}

	// default markup
	defaultonAllData(res) {
		let result = null;
		if (res && res.appliedQuery) {
			result = (
				<div className="row" style={{ marginTop: "60px" }}>
					<pre className="pull-left">
						{JSON.stringify(res.newData, null, 4)}
					</pre>
				</div>
			);
		}
		return result;
	}

	componentDidMount() {
		this.streamProp = this.props.stream;
		this.initialize();
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.streamProp !== this.props.stream) {
				this.streamProp = this.props.stream;
				this.removeChannel();
				this.initialize(true);
			}
			if (this.size !== this.props.size) {
				this.size = this.props.size;
				this.removeChannel();
				this.initialize(true);
			}
		}, 300);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		this.removeChannel();
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel(executeChannel = false) {
		// Set the react - add self aggs query as well with react
		let react = this.props.react ? this.props.react : {};
		const reactAnd = ["streamChanges"];
		react = helper.setupReact(react, reactAnd);
		
		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, react, this.props.size, this.props.from, this.props.stream, this.context.app);
		this.channelId = channelObj.channelId;

		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, (res) => {
			// implementation to prevent initialize query issue if old query response is late then the newer query
			// then we will consider the response of new query and prevent to apply changes for old query response.
			// if queryStartTime of channel response is greater than the previous one only then apply changes
			if (res.error && res.startTime > this.queryStartTime) {
				this.setState({
					queryStart: false,
					showPlaceholder: false
				});
				if (this.props.onAllData) {
					const modifiedData = helper.prepareResultData(res);
					this.props.onAllData(modifiedData.res, modifiedData.err);
				}
			}
			if (res.appliedQuery) {
				if (res.mode === "historic" && res.startTime > this.queryStartTime) {
					const visibleNoResults = res.appliedQuery && res.data && !res.data.error ? (!(res.data.hits && res.data.hits.total)) : false;
					const resultStats = {
						resultFound: !!(res.appliedQuery && res.data && !res.data.error && res.data.hits && res.data.hits.total)
					};
					if (res.appliedQuery && res.data && !res.data.error) {
						resultStats.total = res.data.hits.total;
						resultStats.took = res.data.took;
					}
					this.setState({
						queryStart: false,
						visibleNoResults,
						resultStats,
						showPlaceholder: false
					});
					this.afterChannelResponse(res);
				} else if (res.mode === "streaming") {
					this.afterChannelResponse(res);
					this.updateResultStats(res.data);
				}
			} else {
				this.setState({
					showPlaceholder: true
				});
			}
		});
		this.listenLoadingChannel(channelObj);
		if (executeChannel) {
			const obj = {
				key: "streamChanges",
				value: ""
			};
			helper.selectedSensor.set(obj, true);
		}
	}

	updateResultStats(newData) {
		const resultStats = this.state.resultStats;
		resultStats.total = helper.updateStats(resultStats.total, newData);
		this.setState({
			resultStats
		});
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(`${channelObj.channelId}-query`, (res) => {
			if (res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		});
	}

	afterChannelResponse(res) {
		const data = res.data;
		let rawData,
			markersData,
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
			const normalizeCurrentData = this.normalizeCurrentData(res, this.state.currentData, newData);
			newData = normalizeCurrentData.newData;
			currentData = normalizeCurrentData.currentData;
		}
		this.setState({
			rawData,
			newData,
			currentData,
			markersData,
			isLoading: false
		}, () => {
			// Pass the historic or streaming data in index method
			res.allMarkers = rawData;
			let modifiedData = JSON.parse(JSON.stringify(res));
			modifiedData.newData = this.state.newData;
			modifiedData.currentData = this.state.currentData;
			delete modifiedData.data;
			modifiedData = helper.prepareResultData(modifiedData, res.data);
			const generatedData = this.props.onAllData ? this.props.onAllData(modifiedData.res, modifiedData.err) : this.defaultonAllData(modifiedData.res, modifiedData.err);
			this.setState({
				resultMarkup: generatedData,
				currentData: this.combineCurrentData(newData)
			});
		});
	}

	// normalize current data
	normalizeCurrentData(res, rawData, newData) {
		const appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
		const currentData = JSON.stringify(appliedQuery) === JSON.stringify(this.appliedQuery) ? (rawData || []) : [];
		if (!currentData.length) {
			this.appliedQuery = appliedQuery;
		} else {
			newData = newData.filter((newRecord) => {
				let notExits = true;
				currentData.forEach((oldRecord) => {
					if (`${newRecord._id}-${newRecord._type}` === `${oldRecord._id}-${oldRecord._type}`) {
						notExits = false;
					}
				});
				return notExits;
			});
		}
		return {
			currentData,
			newData
		};
	}

	combineCurrentData(newData) {
		if (_.isArray(newData)) {
			return this.state.currentData.concat(newData);
		}
		return this.streamDataModify(this.state.currentData, newData);
	}

	initialize(executeChannel = false) {
		this.createChannel(executeChannel);
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

	render() {
		let title = null,
			placeholder = null;
		const cx = classNames({
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
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		if (this.props.placeholder) {
			placeholder = (<div className="rbc-placeholder col s12 col-xs-12">{this.props.placeholder}</div>);
		}

		return (
			<div className="rbc-reactiveelement-container">
				<div className={`rbc rbc-reactiveelement card thumbnail ${cx}`} style={this.props.componentStyle}>
					{title}
					{this.state.resultStats && this.state.resultStats.resultFound && this.props.showResultStats ? (<ResultStats onResultStats={this.props.onResultStats} took={this.state.resultStats.took} total={this.state.resultStats.total} />) : null}
					{this.state.resultMarkup}
					{this.state.showPlaceholder ? placeholder : null}
				</div>
				{this.props.noResults && this.state.visibleNoResults ? (<NoResults defaultText={this.props.noResults.text} />) : null}
				{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader.text} />) : null}
				<PoweredBy container="rbc-reactiveelement-container" />
			</div>
		);
	}
}

ReactiveElement.propTypes = {
	componentId: React.PropTypes.string,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	from: helper.validation.resultListFrom,
	onAllData: React.PropTypes.func,
	size: helper.sizeValidation,
	stream: React.PropTypes.bool,
	componentStyle: React.PropTypes.object,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	noResults: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	showResultStats: React.PropTypes.bool,
	onResultStats: React.PropTypes.func,
	react: React.PropTypes.object,
	placeholder: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	])
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
